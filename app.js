const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const Post = require('./src/models/post')

const app = express()
dotenv.config()
const connectionUri = process.env.MONGODB_URI

mongoose
  .connect(connectionUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to Database'))
  .catch(console.erro)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT')
  next()
})

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  post.save()
  res.status(201).json({
    message: 'Post added successfully'
  })
})

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(docs => {
      console.log(docs)
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: docs
      })
    })
})

module.exports = app