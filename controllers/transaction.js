const Transaction = require('../models/Transaction')

module.exports.index = (req, res) => {
    Transaction.find().populate('product').populate('user').then((transactions) => {
        let data = {
            transactions: transactions
        }
        
        res.render('log/index', data)
    })
}