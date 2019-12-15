const Transaction = require('../models/Transaction')

module.exports.index = (req, res) => {
    Transaction.find().populate('product user').sort({
            executedTime: -1
        }).then((transactions) => {
        let data = {
            transactions: transactions
        }
        
        res.render('log/index', data)
    })
}