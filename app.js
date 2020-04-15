const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT')
  next()
})

app.post('/api/posts', (req, res, next) => {
  const post = req.body
  console.log(post)
  res.status(201).json({
    message: 'Post added successfully'
  })
})

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'assfdfb',
      title: 'Title from api 1',
      content: 'Content from api 1'
    }, {
      id: 'dsavsdGD',
      title: 'Title from api 2',
      content: 'Content from api 2'
    }, {
      id: '3REFAVGA',
      title: 'Title from api 3',
      content: 'Content from api 3'
    }
  ]
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts
  })
})

module.exports = app