const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    red: 'Category'
  },
  name: {
    type: mongoose.Schema.Types.String
  },
  description: {
    type: mongoose.Schema.Types.String
  },
  image: {
    type: mongoose.Schema.Types.String
  },
  price: {
    type: mongoose.Schema.Types.Number,
    min: 0,
    max: Number.MAX_VALUE,
    default: 0
  },
  uploadTime: {
    type: mongoose.Schema.Types.Date
  },
  isAuction: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  status: {
    type: mongoose.Schema.Types.String,
    enum: {
      values: ['None', 'Registered', 'InProgress', 'Completed']
    }
  },
  priceHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

let Product = mongoose.model('Product', productSchema)
module.exports = Product
