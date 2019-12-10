let Category = require('../models/Category')

module.exports.index = (req, res) => {
  Category.findOne()
    .populate('products')
    .then((category) => {
      if (!category) {
        res.sendStatus(404)
        return
      }

      res.render('category/index', {
        category: category
      })
    })
}

module.exports.productByCategory = (req, res) => {
  let categoryName = req.params.category

  Category.findOne({name: categoryName})
    .populate('products')
    .then((category) => {
      if (!category) {
        res.sendStatus(404)
        return
      }

      res.render('category/index', {category: category})
    })
}
