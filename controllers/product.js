const fs = require('fs')
const path = require('path')
const Product = require('../models/Product')
const Category = require('../models/Category')
const Transaction = require('../models/Transaction')
const User = require('../models/User')

module.exports.index = (req, res) => {
  Product.find({
    status: "Registered"
  }).populate('category').sort({uploadTime:-1}).then((products) => {
    let data = {
      products: products
    }
    if (req.query.error) {
      data.error = req.query.error
    } else if (req.query.success) {
      data.success = req.query.success
    }
    res.render('allproducts/index', data)
  })
}

module.exports.detailGet = (req, res) => {
  let productId = req.params.id
  
  Product.findById(productId).populate('seller category priceHistory').then(product => {
    if (!product) {
      res.sendStatus(404)
      return
    }

    User.findById(req.user).then((user)=>{
      res.render('product/detail', {
        product: product
      })
    })
    
  })
}


// BUYER
module.exports.purchasePost = (req, res) => {
  let productId = req.body.pid
  
  Product.findById(productId).then(product => {
    if (product.status != "Registered") {
      let error = `error=${encodeURIComponent('You cannot buy')}`
      res.redirect(`/?${error}`)
      return
    }
    product.status = "Completed"
    product.save().then(() => {
      req.user.boughtProducts.push(productId)
      req.user.save().then(() => {
        res.redirect('/user')
      })
    })

    Transaction.create({
      type: "Purchase",
      product: productId,
      user: req.user._id,
      price: product.price
    })
  })
}

module.exports.cancelPurchasePost = (req, res) => {
  let productId = req.body.pid
  
  Product.findById(productId).then(product => {
    if (product.status != "Completed") {
      let error = `error=${encodeURIComponent('You cannot cancel purchase')}`
      res.redirect(`/?${error}`)
      return
    }

    product.status = "Registered"
    product.save().then(() => {
      req.user.boughtProducts.findByIdAndRemove(productId)
      req.user.save().then(() => {
        res.redirect('/user')
      })
    })

    Transaction.create({
      type: "CancelPurchase",
      product: productId,
      user: req.user._id,
      price: product.price
    })
  })

}

module.exports.bidPost = (req, res) => {
  let productId = req.body.pid
  let price = req.body.bid_price

  Product.findById(productId).then(product => {
    if (product.status != "Registered") {
      let error = `error=${encodeURIComponent('You cannot bid')}`
      res.redirect(`/?${error}`)
      return
    }
    Transaction.create({
      type: "Bid",
      product: productId,
      user: req.user._id,
      price: price
    }).then((transaction) => {
      product.price = price
      product.priceHistory.push(transaction._id)
      product.save().then(() => {
        req.user.bidProducts.push(productId)
        req.user.save().then(() => {
          res.redirect('/product/' + productId)
        })
      })
    })
  })
}


// SELLER
module.exports.registerGet = (req, res) => {
  Category.find().then((categories) => {
    res.render('product/register', {categories: categories})
  })
}

module.exports.registerPost = (req, res) => {
  let productObj = req.body
  productObj.image = '\\' + req.file.path
  productObj.status = 'Registered'
  productObj.seller = req.user._id
  if (!req.body.price) {
    productObj.price = 0
  } else
    productObj.price = req.body.price
  
  
  Product.create(productObj).then((product) => {
    Category.findById(product.category).then((category) => {
      category.products.push(product._id)
      category.save()
    })
    console.log(product)

    req.user.createdProducts.push(product._id)
    req.user.save()

    Transaction.create({
      type: "Register",
      product: product._id,
      user: req.user._id,
      price: product.price
    })

    res.redirect('/product/' + product._id)
  })

}

module.exports.unregisterPost = (req, res) => {
  let productId = req.body.pid

  Product.findById(productId).then((product) => {
    if (!product || !product.status.equals("Registered")) {
      res.redirect(`/?error=${encodeURIComponent('You cannot unregister the product')}`)
      return
    }

    if (product.seller.equals(req.user._id) &&req.user.role.equals('Seller')) {
      Category.findById(product.category).then((category) => {
        let index = category.products.indexOf(id)
        if (index >= 0) {
          category.products.splice(index, 1)
        }

        category.save()

        Product.remove({
          _id: id
        }).then(() => {
          fs.unlink(path.normalize(path.join('.', product.image)), () => {
            res.redirect(`/?error=${encodeURIComponent('Product was deleted successfully')}`)
          })
        })
      })
    } else {
      res.redirect(`/?error=${encodeURIComponent('You cannot delete this product!')}`)
    }
  })
}

module.exports.editGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      res.sendStatus(404)
      return
    }

    if (product.seller.equals(req.user._id) &&
    req.user.role.equals('Seller')) {
      Category.find().then((categories) => {
        res.render('product/edit', {
          product: product,
          categories: categories
        })
      })
    } else {
      res.redirect(`/?error=${encodeURIComponent('You cannot edit this product!')}`)
    }
  })
}

module.exports.editPost = (req, res) => {
  let id = req.params.id
  let editedProduct = req.body

  Product.findById(id).then((product) => {
    if (!product) {
      res.redirect(`/?error=${encodeURIComponent('You cannot edit this product')}`)
      return
    }

    if (product.seller.equals(req.user._id) &&
      req.user.role.equals('Seller')) {
      product.name = editedProduct.name
      product.description = editedProduct.description
      product.price = editedProduct.description
      

      if (req.file) {
        product.image = '\\' + req.file.path
      }

      if (product.isAuction != editedProduct.isAuction) {
        res.redirect(`/?error=${encodeURIComponent('You cannot change to auction or vice versa')}`)
      }
      if (product.category.toString() !== editedProduct.category) {
        Category.findById(product.category).then(
          (currentCategory) => {
            Category.findById(editedProduct.category).then((nextCategory) => {
              let index = currentCategory.products.indexOf(product._id)
              if (index >= 0) {
                currentCategory.products.splice(index, 1)
              }
              currentCategory.save()

              product.category = editedProduct.category

              product.save().then(() => {
                res.redirect('/?success=' + encodeURIComponent('Product was edited successfully'))
              })
            })
          }
        )
      } else {
        product.save().then(() => {
          res.redirect('/?success' + encodeURIComponent('Product was edited successfully'))
        })
      }

    } else {
      res.redirect(`/?error=${encodeURIComponent('You cannot edit this product!')}`)
    }
  })
}


module.exports.drawPost = (req, res) => {
  let productId = req.body.pid

  Product.findById(productId).then(product => {
    if (product.status != "Registered") {
      let error = `error=${encodeURIComponent('You cannot draw')}`
      res.redirect(`/?${error}`)
      return
    }
    product.status = "Completed"
    product.save().then(() => {
      res.redirect('/user')
    })

    Transaction.create({
      type: "Draw",
      product: productId,
      user: req.user._id,
      price: product.price
    })
  })
}

module.exports.cancelDrawPost = (req, res) => {
  let productId = req.body.pid

  Product.findById(productId).then(product => {
    if (product.status != "Completed") {
      let error = `error=${encodeURIComponent('You cannot cancel draw')}`
      res.redirect(`/?${error}`)
      return
    }

    product.status = "Registered"
    product.save().then(() => {
      res.redirect('/user')
    })

    Transaction.create({
      type: "CancelDraw",
      product: productId,
      user: req.user._id,
      price: product.price
    })
  })

}

