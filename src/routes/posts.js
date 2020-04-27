const multer = require('multer')
const express = require('express')
const checkAuth = require('./../middleware/check-auth')
const {
  createPost,
  editPost,
  getPost,
  getPosts,
  deletePost,
} = require('./../controllers/posts')

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}
const router = new express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error(`Invalid mime type ${file.mimetype}`)
    if (isValid) {
      error = null
    }
    cb(error, 'images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, `${name}-${Date.now()}.${ext}`)
  },
})

const imageProcess = multer({ storage }).single('image')

router.post('', checkAuth, imageProcess, createPost)
router.put('/:postId', checkAuth, imageProcess, editPost)
router.get('/:postId', getPost)
router.get('', getPosts)
router.delete('/:id', checkAuth, deletePost)

module.exports = router
