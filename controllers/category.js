let Category = require('../models/Category')

module.exports.index = (req, res) => {
  Category.find().then((categories) => {
      Category.findOne().populate('products').then((selectedCategory) => {
        res.render('category/index', {
          categories: categories,
          selectedCategory: selectedCategory
        })
      })

    })
}

module.exports.productByCategory = (req, res) => {
  let categoryName = req.params.category

  Category.find()
    .then((categories) => {
      if (!categories) {
        res.sendStatus(404)
        return
      }
      Category.findOne({name:categoryName}).populate('products').then((selectedCategory)=> {
        res.render('category/index', {
          categories: categories,
          selectedCategory: selectedCategory
        })
      })
      
    })
}
