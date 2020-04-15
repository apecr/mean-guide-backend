const express = require('express')

const app = express()

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 1,
      title: 'Title from api 1',
      content: 'Content from api 1'
    }, {
      id: 2,
      title: 'Title from api 2',
      content: 'Content from api 2'
    }, {
      id: 3,
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