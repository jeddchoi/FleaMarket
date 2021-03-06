const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
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
    type: mongoose.Schema.Types.Date,
    default: Date.now
  },
  isAuction: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  status: {
    type: mongoose.Schema.Types.String,
    enum: {
      values: ['None', 'Registered', 'Completed']
    }
  },
  priceHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  wishCount: {
    type: mongoose.Schema.Types.Number,
    min: 0,
    max: Number.MAX_VALUE,
    default: 0
  }
})

let Product = mongoose.model('Product', productSchema)
module.exports = Product
