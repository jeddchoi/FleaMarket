const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
const propertyIsRequired = '{0} is required.'

let userSchema = mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.String,
    enum: {
      values: ['Buyer', 'Seller', 'Admin'],
      message: 'Role should be either "Buyer" or "Seller".'
    }
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: propertyIsRequired.replace('{0}', 'Username'),
    unique: true
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: propertyIsRequired.replace('{0}', 'Password')
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: propertyIsRequired.replace('{0}', 'Name')
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: propertyIsRequired.replace('{0}', 'Email')
  },
  address: {
    type: mongoose.Schema.Types.String,
    required: propertyIsRequired.replace('{0}', 'Address')
  },
  boughtProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  bidProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  salt: {
    type: mongoose.Schema.Types.String,
    required: true
  }
})

userSchema.method({
  authenticate: function (password) {
    let hashedPassword = encryption.generateHashedPassword(this.salt, password)

    if (hashedPassword === this.password) {
      return true
    }
    return false
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User

module.exports.seedAdminUser = () => {
  User.find({
    username: 'admin'
  }).then(users => {
    if (users.length === 0) {
      let salt = encryption.generateSalt()
      let hashedPass = encryption.generateHashedPassword(salt, 'admin')

      User.create({
        role: 'Admin',
        username: 'admin',
        password: hashedPass,
        name: 'administrator',
        email: 'jed.gy.choi@gmail.com',
        address: 'somewhere',
        salt: salt
      })
    }
  })
}
