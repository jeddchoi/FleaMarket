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
  app.post('/product/:id/buy', auth.isInRole(['Buyer']), controllers.product.buyPost)
  app.post('/product/:id/bid', auth.isInRole(['Buyer']), controllers.product.bidPost)
  app.get('/product/:id/edit', auth.isInRole(['Seller']), controllers.product.editGet)
  app.post('/product/:id/edit', auth.isInRole(['Seller']), upload.single('image'), controllers.product.editPost)
  app.get('/product/:id/delete', auth.isInRole(['Seller']), controllers.product.deleteGet)
  app.post('/product/:id/delete', auth.isInRole(['Seller']), controllers.product.deletePost)

  app.get('/wishlist', auth.isInRole(['Buyer']), controllers.user.wishlist)
  
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
