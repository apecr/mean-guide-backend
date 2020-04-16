const express = require('express')
const router = new express.Router()
const Post = require('./../models/post')

router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  })
  post.save().then((result) => {
    res.status(201).json({
      message: 'Post added successfully',
      post: result,
    })
  })
})

router.put('/:postId', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  })
  console.log(post)
  Post.updateOne({ _id: req.params.postId }, post).then((result) => {
    res.status(200).json({
      message: 'Update successful',
    })
  })
})

router.get('/:postId', (req, res, next) => {
  Post.findById(req.params.postId).then((post) => {
    if (post) {
      return res.status(200).json(post)
    }
    return res.status(404).json({ message: 'Post not found' })
  })
})

router.get('', (req, res, next) => {
  Post.find().then((docs) => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: docs,
    })
  })
})

router.delete('/:id', (req, res, next) => {
  console.log(req.params.id)
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({
      message: `Post ${req.params.id} deleted`,
      id: result._id,
    })
  })
})

module.exports = router
