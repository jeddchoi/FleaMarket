const Product = require('../models/Product')

module.exports.index = (req, res) => {
  let queryData = req.query

  // find all registered products
  Product.find({status:'Registered'}).populate('category').then((products) => {
    if (queryData.query) {
      products = products.filter(p => p.name.toLowerCase().includes(queryData.query))
    }

    let data = {products: products}
    if (req.query.error) {
      data.error = req.query.error
    } else if (req.query.success) {
      data.success = req.query.success
    }
    res.render('home/index', data)
  })
}

module.exports.searchGet = (req, res) => {
  Product.find().then((products) => {
    res.render('home/search', {products : products})
  })
}

module.exports.searchPost = (req, res) => {
  let productName = req.body.productName
  let sellerName = req.body.sellerName
  let lowPrice = req.body.lowPrice
  let highPrice = req.body.highPrice


    Product.find({
      $and: [{
          name: {
            $regex: `.*${productName}.*`
          }
        },
        {
          price: {
            $gt: lowPrice
          }
        },
        {
          price: {
            $lt: highPrice
          }
        }
      ]
    }, {multi: true}).populate('seller').then((products) => {
      
      let data = {
        products: []
      }
      for (let product in products) {
        console.log(product)
        if (product.seller.name.toString().match(`.*${sellerName}.*`)) {
          data.products.push(product)
        }
      }
      
      res.render('home/search', data)
    })
}