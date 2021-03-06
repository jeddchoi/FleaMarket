const User = require('../models/User')
const encryption = require('../utilities/encryption')
const Product = require('../models/Product')

module.exports.index = (req, res) => {
  if (req.user) {
    switch (req.user.role) {
      case 'Buyer':
        User.findById(req.user._id).populate('boughtProducts bidProducts').then((user) => {
          
          let totalAmount = 0
          
          for (let i = 0; i < user.boughtProducts.length; i++) {
            let product = user.boughtProducts[i];
            totalAmount += product.price
          }

          for (let i = 0; i < user.bidProducts.length; i++) {
            let product = user.bidProducts[i];
            if (product.status == "Completed") {
              totalAmount += product.price
            }
          }

          res.render('user/mypage_buyer', {
            user: user,
            totalAmount:totalAmount
          })
        })
        break

      case 'Seller':
        User.findById(req.user._id).populate('createdProducts').then((user) => {
          res.render('user/mypage_seller', {
            user: user
          })
        })
        break

      case 'Admin':
        res.render('user/mypage_admin')
        break
    }
  } else {
    res.redirect('/user/login')
  }
}


module.exports.registerGet = (req, res) => {
  res.render('user/register')
}

module.exports.registerPost = (req, res) => {
  let user = req.body

  if (user.password && user.password !== user.confirmedPassword) {
    user.error = 'Passwords do not match.'
    res.render('user/register', user)
    return
  }

  let salt = encryption.generateSalt()
  user.salt = salt

  if (user.password) {
    let hashedPassword = encryption.generateHashedPassword(salt, user.password)
    user.password = hashedPassword
  }

  User.create(user).then(user => {
    req.logIn(user, (error, user) => {
      if (error) {
        res.render('user/register', {
          error: 'Authentication not working!'
        })
        return
      }

      res.redirect('/')
    })
  }).catch(error => {
    user.error = error
    res.render('user/register', user)
  })
}

module.exports.wishlistGet = (req, res) => {
  User.findById(req.user._id).populate('wishlist').then((user) => {
    if (!user) {
      res.redirect(`/?error=${encodeURIComponent('User was not found!')}`)
      return
    }

    res.render('wishlist/index', {
      products: user.wishlist
    })
  })
}

module.exports.wishlistPost = (req, res) => {
  let productId = req.body.pid

  User.findById(req.user._id).then((user) => {
    if (!user.wishlist.includes(productId)) {
      req.user.wishlist.push(productId)
      Product.find
      Product.findByIdAndUpdate(productId, {
        $inc: {
          wishCount: 1
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }, (error, doc) => {
        req.user.save().then(() => {
          res.redirect('/wishlist')
        })
      })

    } else {
      res.redirect('/wishlist')
    }
  })

}


module.exports.loginGet = (req, res) => {
  res.render('user/login')
}

module.exports.loginPost = (req, res) => {
  let userToLogin = req.body

  User.findOne({
    username: userToLogin.username
  }).then(user => {
    if (!user || !user.authenticate(userToLogin.password)) {
      res.render('user/login', {
        error: 'Invalid credentials!'
      })
    } else {
      req.logIn(user, (error, user) => {
        if (error) {
          res.render('user/login', {
            error: 'Authentication not working!'
          })
          return
        }
        res.redirect('/')
      })
    }
  })
}

module.exports.logout = (req, res) => {
  req.logout()
  res.redirect('/')
}


module.exports.getUsers = (req, res) => {

  User.find().populate('boughtProducts').populate('createdProducts').populate('bidProducts').then((users) => {
    res.render('member/index', {
      users: users
    })
  })
}

module.exports.detailGet = (req, res) => {
  let userId = req.params.id

  User.findById(userId).populate('boughtProducts').populate('createdProducts').populate('bidProducts').then((user) => {
    res.render('member/detail', {
      user: user
    })
  })
  res.render('member/detail')
}

module.exports.editGet = (req, res) => {
  let userId = req.params.id

  User.findById(userId).then(user => {
    if (!user) {
      res.sendStatus(404)
      return
    }

    if (req.user.role == 'Admin') {
      res.render('member/edit', {
        user: user
      })
    } else {
      res.redirect(`/?error=${encodeURIComponent('You cannot edit this user!')}`)
    }
  })
}

module.exports.editPost = (req, res) => {
  let userId = req.params.id
  let editedUser = req.body

  User.findById(userId).then((user) => {
    if (!user) {
      res.redirect(`/?error=${encodeURIComponent('You cannot edit this product')}`)
      return
    }

    if (req.user.role == 'Admin') {
      user.username = editedUser.username
      user.name = editedUser.name
      user.email = editedUser.email
      user.address = editedUser.address

      if (editedUser.password && editedUser.password !== editedUser.confirmedPassword) {
        user.error = 'Passwords do not match.'
        res.redirect('/member')
        return
      }

      let salt = encryption.generateSalt()
      user.salt = salt

      if (editedUser.password) {
        let hashedPassword = encryption.generateHashedPassword(salt, editedUser.password)
        user.password = hashedPassword
      }

      user.save().then(() => {
        res.redirect('/member')
      })

    } else {
      res.redirect(`/?error=${encodeURIComponent('You cannot edit this user!')}`)
    }
  })
}

module.exports.deletePost = (req, res) => {
  let userId = req.params.id

  if (req.user.role == 'Admin') {
    User.findByIdAndRemove(userId).then(() => {
      res.redirect('/member')
    })
  }
}