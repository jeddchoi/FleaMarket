const mongoose = require('mongoose')

let transactionSchema = mongoose.Schema({
    type: {
        type: mongoose.Schema.Types.String,
        enum: {
            values: ['Register', 'Unregister', 'Purchase', 'CancelPurchase', 'Bid', 'Draw', 'CancelDraw', 'ConfirmSale', 'ConfirmPurchase']
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
    executedTime: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },
    price: {
        type: mongoose.Schema.Types.Number
    }
})

let Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction
