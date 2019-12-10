const fs = require('fs')
const path = require('path')
const Product = require('../models/Product')
const Category = require('../models/Category')

module.exports.index = (req, res) => {
  
  Product.find({
    buyer: null
  }).populate('category').then((products) => {
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
  console.log('detailGET')
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      res.sendStatus(404)
      return
    }
    res.render('product/detail', {product:product})
  })
}

// module.exports.buyGet = (req, res) => {
//   let id = req.params.id
//   Product.findById(id).then(product => {
//     if (!product) {
//       res.sendStatus(404)
//       return
//     }

//     res.render('product/buy', {
//       product: product
//     })
//   })
// }

module.exports.buyPost = (req, res) => {
  let productId = req.params.id

  Product.findById(productId).then(product => {
    if (product.buyer) {
      let error = `error=${encodeURIComponent('Product was already bought')}`
      res.redirect(`/?${error}`)
      return
    }

    product.buyer = req.user._id
    product.save().then(() => {
      req.user.boughtProducts.push(productId)
      req.user.save().then(() => {
        res.redirect('/')
      })
    })
  })
}

module.exports.bidPost = (req, res) => {
  let productId = req.params.id

  Product.findById(productId).then(product => {
    if (product.buyer) {
      let error = `error=${encodeURIComponent('Product was already bought')}`
      res.redirect(`/?${error}`)
      return
    }

    product.buyer = req.user._id
    product.save().then(() => {
      req.user.boughtProducts.push(productId)
      req.user.save().then(() => {
        res.redirect('/')
      })
    })
  })
}


module.exports.registerGet = (req, res) => {
  Category.find().then((categories) => {
    res.render('product/register', {categories: categories})
  })
}

module.exports.registerPost = (req, res) => {
  let productObj = req.body
  productObj.image = '\\' + req.file.path
  productObj.creator = req.user._id

  Product.create(productObj).then((product) => {
    Category.findById(product.category).then((category) => {
      category.products.push(product._id)
      category.save()
    })
    res.redirect('/')
  })
}

module.exports.editGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      res.sendStatus(404)
      return
    }

    if (product.creator.equals(req.user._id) ||
    req.user.role.indexOf('Admin') >= 0) {
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
      res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`)
      return
    }

    if (product.creator.equals(req.user._id) ||
    req.user.role.indexOf('Admin') >= 0) {
      product.name = editedProduct.name
      product.description = editedProduct.description
      product.price = editedProduct.description

      if (req.file) {
        product.image = '\\' + req.file.path
      }

      if (product.category.toString() !== editedProduct.category) {
        Category.findById(product.category).then(
          (currentCategory) => {
            Category.findById(editedProduct.categories).then((nextCategory) => {
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

module.exports.deleteGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      res.sendStatus(404)
      return
    }

    if (product.creator.equals(req.user._id) || req.user.role.indexOf('Admin') >= 0) {
      res.render('product/delete', {product: product})
    } else {
      res.redirect(`/?error=${encodeURIComponent('You cannot delete this product!')}`)
    }
  })
}

module.exports.deletePost = (req, res) => {
  let id = req.params.id

  Product.findById(id).then((product) => {
    if (!product) {
      res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`)
      return
    }

    if (product.creator.equals(req.user._id) || req.user.role.indexOf('Admin') >= 0) {
      Category.findById(product.category).then((category) => {
        let index = category.products.indexOf(id)
        if (index >= 0) {
          category.products.splice(index, 1)
        }

        category.save()

        Product.remove({_id: id}).then(() => {
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

