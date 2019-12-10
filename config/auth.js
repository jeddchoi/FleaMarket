module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/user/login')
    }
  },
  isInRole: (roles) => {
    return (req, res, next) => {
      if (req.user && roles.indexOf(req.user.role) > -1) {
        console.log('Authentication passed!')
        next()
      } else {
        res.redirect('/user/login')
      }
    }
  }
}
