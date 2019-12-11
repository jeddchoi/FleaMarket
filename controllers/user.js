const User = require('../models/User')
const encryption = require('../utilities/encryption')

module.exports.index = (req, res) => {
  if (req.user) {
    switch (req.user.role) {
      case 'Buyer':
        res.render('./user/mypage_buyer')
        break

      case 'Seller':
        res.render('./user/mypage_seller')
        break

      case 'Admin':
        res.render('./user/mypage_admin')
        break
    }
  } else {
    res.redirect('/user/login')
  }
}

module.exports.wishlistGet = (req, res) => {
<<<<<<< HEAD
  User.findById(req.user._id).populate('wishlist').then((products)=> {
    res.render('/wishlist/index', {products:products})
  })
=======
  res.render('./wishlist/index')
>>>>>>> 2fc615ef834445593234c2d508cad8555515873f
}

module.exports.wishlistPost = (req, res) => {
  res.render('./wishlist/index')
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
        res.render('user/register', {error: 'Authentication not working!'})
        return
      }

      res.redirect('/')
    })
  }).catch(error => {
    user.error = error
    res.render('user/register', user)
  })
}

module.exports.loginGet = (req, res) => {
  res.render('user/login')
}

module.exports.loginPost = (req, res) => {
  let userToLogin = req.body

  User.findOne({username: userToLogin.username}).then(user => {
    if (!user || !user.authenticate(userToLogin.password)) {
      res.render('user/login', {error: 'Invalid credentials!'})
    } else {
      req.logIn(user, (error, user) => {
        if (error) {
          res.render('user/login', {error: 'Authentication not working!'})
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
  res.render('/member/index')
}

module.exports.detailGet = (req, res) => {
  res.render('/member/detail')
}

module.exports.editGet = (req, res) => {
  res.render('/member/edit')
}

module.exports.editPost = (req, res) => {
  res.render('/member/index')
}

module.exports.deleteGet = (req, res) => {
  res.render('/member')
}

module.exports.deletePost = (req, res) => {
  res.render('/member')
}