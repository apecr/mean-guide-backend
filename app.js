const express = require('express')

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT')
  next()
})

app.use('/api/posts', (req, res, next) => {
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
    message: 'Post sent successfully',
    posts
  })
})

module.exports = app