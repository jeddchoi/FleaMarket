const fs = require('fs')
const path = require('path')
const Product = require('../models/Product')
const Category = require('../models/Category')
const Transaction = require('../models/Transaction')
const User = require('../models/User')

module.exports.index = (req, res) => {
  Product.find({
    status: "Registered"
  }).populate('category').sort({
    uploadTime: -1
  }).then((products) => {
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

  Product.findById(productId).populate('seller category').populate({
    path: 'priceHistory',
    populate: {
      path: 'user',
      model: 'User'
    }
  }).then(product => {
    if (!product) {
      res.sendStatus(404)
      return
    }

    User.findById(req.user).then((user) => {
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
    res.render('product/register', {
      categories: categories
    })
  })
}

module.exports.registerPost = (req, res) => {
  let productObj = req.body
  productObj.image = '/images/' + req.file.filename
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
    if (product.seller.equals(req.user._id) && req.user.role == 'Seller') {
      if (!product || !product.status == "Registered") {
        res.redirect(`/?error=${encodeURIComponent('You cannot unregister the product')}`)
        return
      }
      product.remove().then(() => {
        console.log('Successfully Removed')
      })
      Category.update({
        _id: product.category
      }, {
        $pull: {
          products: product._id
        }
      })
      res.redirect('/user')
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
      req.user.role == 'Seller') {
      Category.find().then((categories) => {
        res.render('product/edit', {
          product: product,
          categories: categories
        })
      })
    } else {
      res.redirect(`/?error=${encodeURIComponent('You cannot edit this product! : edit')}`)
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
      req.user.role == 'Seller') {
      
      product.isAuction = editedProduct.isAuction
      product.name = editedProduct.name
      product.description = editedProduct.description
      if (!req.body.price) {
        product.price = 0
      } else {
        product.price = editedProduct.price
      }
      if (req.file)
        product.image = '/images/' + req.file.filename

      if (product.category !== editedProduct.category) {
        Category.findById(product.category).then(
          (currentCategory) => {
            let index = currentCategory.products.indexOf(product._id)
            if (index >= 0) {
              currentCategory.products.splice(index, 1)
            }
            currentCategory.save()
          })

        Category.findById(editedProduct.category).then((nextCategory) => {
          nextCategory.products.push(product._id)
          nextCategory.save()
        })

        product.category = editedProduct.category
      }

      product.save().then(() => {
        res.redirect('/user')
      })
    } else {
      res.redirect(`/?error=${encodeURIComponent('You cannot edit this product!')}`)
    }
  })
}


module.exports.drawPost = (req, res) => {
  let productId = req.body.pid

  Product.findById(productId).then(product => {
    if (product.status !== "Registered") {
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
