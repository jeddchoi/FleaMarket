const controllers = require('../controllers')
const multer = require('multer')
const auth = require('./auth')

let upload = multer({dest: './content/images'})

module.exports = (app) => {
  app.get('/', controllers.home.index)

  // product
  app.get('/product', controllers.product.index)
  

  app.get('/category', controllers.category.index)
  app.get('/category/:category', controllers.category.productByCategory)


  app.get('/product/register', auth.isInRole(['Seller']), controllers.product.registerGet)
  app.post('/product/register', auth.isInRole(['Seller']), upload.single('image'), controllers.product.registerPost)
  
  app.get('/product/:id', controllers.product.detailGet)
  app.post('/product/:id/unregister', auth.isInRole(['Seller']), controllers.product.unregisterPost)

  app.post('/product/:id/purchase', auth.isInRole(['Buyer']), controllers.product.purchasePost)
  app.post('/product/:id/cancel_purchase', auth.isInRole(['Buyer']), controllers.product.cancelPurchasePost)
  app.post('/product/:id/confirm_sale', auth.isInRole(['Seller']), controllers.product.confirmSalePost)

  app.post('/product/:id/bid', auth.isInRole(['Buyer']), controllers.product.bidPost)
  app.post('/product/:id/draw', auth.isInRole(['Seller']), controllers.product.drawPost)
  app.post('/product/:id/cancel_draw', auth.isInRole(['Seller']), controllers.product.cancelDrawPost)
  app.post('/product/:id/confirm_purchase', auth.isInRole(['Buyer']), controllers.product.confirmPurchasePost)

  app.get('/product/:id/edit', auth.isInRole(['Seller']), controllers.product.editGet)
  app.post('/product/:id/edit', auth.isInRole(['Seller']), upload.single('image'), controllers.product.editPost)
  app.get('/product/:id/delete', auth.isInRole(['Seller']), controllers.product.deleteGet)
  app.post('/product/:id/delete', auth.isInRole(['Seller']), controllers.product.deletePost)

  app.get('/wishlist', auth.isInRole(['Buyer']), controllers.user.wishlistGet)
  app.get('/wishlist', auth.isInRole(['Buyer']), controllers.user.wishlistPost)

  app.get('/member', auth.isInRole(['Admin']), controllers.user.getUsers)
  app.get('/member/:id', auth.isInRole(['Admin']), controllers.user.detailGet)
  app.get('/member/:id/edit', auth.isInRole(['Admin']), controllers.user.editGet)
  app.post('/member/:id/edit', auth.isInRole(['Admin']), controllers.user.editPost)
  app.get('/member/:id/delete', auth.isInRole(['Admin']), controllers.user.deleteGet)
  app.post('/member/:id/delete', auth.isInRole(['Admin']), controllers.user.deletePost)

  app.get('/logs', auth.isInRole(['Admin']), controllers.transaction.index)


  app.get('/user', controllers.user.index)
  app.get('/user/register', controllers.user.registerGet)
  app.post('/user/register', controllers.user.registerPost)

  app.get('/user/login', controllers.user.loginGet)
  app.post('/user/login', controllers.user.loginPost)

  app.post('/user/logout', auth.isAuthenticated, controllers.user.logout)
}
