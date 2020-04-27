const express = require('express')
const checkAuth = require('./../middleware/check-auth')
const { imageProcess } = require('./../middleware/image')
const {
  createPost,
  editPost,
  getPost,
  getPosts,
  deletePost,
} = require('./../controllers/posts')

const router = new express.Router()

router.post('', checkAuth, imageProcess, createPost)
router.put('/:postId', checkAuth, imageProcess, editPost)
router.get('/:postId', getPost)
router.get('', getPosts)
router.delete('/:id', checkAuth, deletePost)

module.exports = router
