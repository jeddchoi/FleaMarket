const mongoose = require('mongoose')

let transactionSchema = mongoose.Schema({
    type: {
        type: mongoose.Schema.Types.String,
        enum: {
            values: ['Register', 'Unregister', 'Purchase', 'CancelPurchase', 'Bid', 'Draw', 'CancelDraw']
        }
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    price: {
        type: mongoose.Schema.Types.Number
    },
    executedTime: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
})

let Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction
