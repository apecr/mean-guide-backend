const multer = require('multer')
const express = require('express')
const checkAuth = require('./../middleware/check-auth')
const Post = require('./../models/post')

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}
const router = new express.Router()
const getFilePathFromServer = (req) => {
  const urlPath = `${req.protocol}://${req.get('host')}`
  return `${urlPath}/images/${req.file.filename}`
}
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

router.post(
  '',
  checkAuth,
  multer({ storage }).single('image'),
  (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: getFilePathFromServer(req),
      creator: req.userData.userId,
    })
    post.save().then((result) => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...result,
          id: result._id,
        },
      })
    })
  }
)

router.put(
  '/:postId',
  checkAuth,
  multer({ storage }).single('image'),
  (req, res, next) => {
    console.log(req.file)
    console.log(JSON.stringify(req.body))
    const post = new Post({
      _id: req.body.id,
      ...req.body,
      creator: req.userData.userId
    })
    post.imagePath = req.file ? getFilePathFromServer(req) : req.body.imagePath
    console.log(post)
    Post.updateOne(
      { _id: req.params.postId, creator: req.userData.userId },
      post
    ).then((result) => {
      if (result.n > 0) {
        return res.status(200).json({
          message: 'Update successful',
          post: result,
        })
      }
      res.status(401).json({ message: 'Not Authorized to update the post' })
    })
  }
)

router.get('/:postId', (req, res, next) => {
  Post.findById(req.params.postId).then((post) => {
    if (post) {
      return res.status(200).json(post)
    }
    return res.status(404).json({ message: 'Post not found' })
  })
})

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize
  const currentPage = +req.query.page
  console.log(req.query)
  console.log(pageSize, currentPage)
  const postQuery = Post.find()
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
  }
  postQuery.then((docs) => {
    return Post.estimatedDocumentCount().then((count) => {
      console.log(docs)
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: docs,
        count,
      })
    })
  })
})

router.delete('/:id', checkAuth, (req, res, next) => {
  console.log(req.params.id)
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.n > 0) {
        return res.status(200).json({
          message: `Post ${req.params.id} deleted`,
          id: result._id,
        })
      }
      res.status(401).json({ message: 'Not Authorized to delete the post' })
    }
  )
})

module.exports = router
