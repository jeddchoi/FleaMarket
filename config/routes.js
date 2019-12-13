const controllers = require('../controllers')
const multer = require('multer')
const auth = require('./auth')

let upload = multer({dest: './content/images'})

module.exports = (app) => {
  // main page
  app.get('/', controllers.home.index)

  app.get('/search', controllers.home.search)
  // all products
  app.get('/product', controllers.product.index)
  
  // category
  app.get('/category', controllers.category.index)
  // specific category
  app.get('/category/:category', controllers.category.productByCategory)
  // product registeration page
  app.get('/product/register', auth.isInRole(['Seller']), controllers.product.registerGet)

  // ------------------- You need to pass <input type="hidden" name="pid" value="ObjectId(...)"> --------------------
  // when seller submit to register a product
  app.post('/product/register', auth.isInRole(['Seller']), upload.single('image'), controllers.product.registerPost)
  // when seller submit to unregister a product
  app.post('/product/unregister', auth.isInRole(['Seller']), controllers.product.unregisterPost)
  // when buyer submit to purcahse a product
  app.post('/product/purchase', auth.isInRole(['Buyer']), controllers.product.purchasePost)
  // when buyer submit to cancel purchase in normal purchase
  app.post('/product/cancel_purchase', auth.isInRole(['Buyer']), controllers.product.cancelPurchasePost)
  

  // ------ auction ------
  // when buyer submit to bid by buyer
  app.post('/product/bid', auth.isInRole(['Buyer']), controllers.product.bidPost)
  // when seller submit to draw auction
  app.post('/product/draw', auth.isInRole(['Seller']), controllers.product.drawPost)
  // when seller submit to cancel to draw auction
  app.post('/product/cancel_draw', auth.isInRole(['Seller']), controllers.product.cancelDrawPost)
  

  
  // detail web page
  app.get('/product/:id', controllers.product.detailGet)
  // product edit page
  app.get('/product/:id/edit', auth.isInRole(['Seller']), controllers.product.editGet)
  // when seller submit to edit a product
  app.post('/product/:id/edit', auth.isInRole(['Seller']), upload.single('image'), controllers.product.editPost)
  
  
  // wish list view page
  app.get('/wishlist', auth.isInRole(['Buyer']), controllers.user.wishlistGet)
  // when buyer submit to add a product in wishlist
  app.post('/wishlist', auth.isInRole(['Buyer']), controllers.user.wishlistPost)

  // members view page
  app.get('/member', auth.isInRole(['Admin']), controllers.user.getUsers)
  // member detail view page
  app.get('/member/:id', auth.isInRole(['Admin']), controllers.user.detailGet)
  // member edit page
  app.get('/member/:id/edit', auth.isInRole(['Admin']), controllers.user.editGet)
  // when admin submit to edit member information
  app.post('/member/:id/edit', auth.isInRole(['Admin']), controllers.user.editPost)
  // when admin submit to delete a member
  app.post('/member/:id/delete', auth.isInRole(['Admin']), controllers.user.deletePost)

  // logs view page
  app.get('/logs', auth.isInRole(['Admin']), controllers.transaction.index)

  // mypage view
  app.get('/user', controllers.user.index)
  // signup page
  app.get('/user/register', controllers.user.registerGet)
  // when submit to register an account
  app.post('/user/register', controllers.user.registerPost)

  // login page
  app.get('/user/login', controllers.user.loginGet)
  // when submit to login
  app.post('/user/login', controllers.user.loginPost)
  // when submit to logout
  app.post('/user/logout', auth.isAuthenticated, controllers.user.logout)
}
