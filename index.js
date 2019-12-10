const port = 3500
const config = require('./config/config')
const database = require('./config/database.config')
const express = require('express')

let app = express()
let environment = process.env.NODE_environment || 'development'

database(config[environment])
require('./config/express')(app, config[environment])
require('./config/routes')(app)
require('./config/passport')()
require('./models/User').seedAdminUser()

app.listen(port)
console.log(`Node.js server running on port ${port}`)
app.use(express.static('content'));