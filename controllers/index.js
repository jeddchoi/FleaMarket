const homeController = require('./home')
const productController = require('./product')
const categoryController = require('./category')
const userController = require('./user')
const transactionController = require('./transaction')

module.exports = {
  home: homeController,
  product: productController,
  category: categoryController,
  user: userController,
  transaction: transactionController
}
