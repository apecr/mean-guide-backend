const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const postsRoutes = require('./src/routes/posts')
const userRoutes = require('./src/routes/user')

const app = express()
const connectionUri = process.env.MONGODB_URI

mongoose
  .connect(connectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Connected to Database'))
  .catch(console.error)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/images', express.static('images'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS, PUT'
  )
  next()
})

app.use('/api/posts', postsRoutes)
app.use('/api/user', userRoutes)

module.exports = app
