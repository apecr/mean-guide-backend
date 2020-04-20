const multer = require('multer')
const express = require('express')
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

router.post('', multer({ storage }).single('image'), (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: getFilePathFromServer(req),
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
})

router.put(
  '/:postId',
  multer({ storage }).single('image'),
  (req, res, next) => {
    console.log(req.file)
    console.log(JSON.stringify(req.body))
    const post = new Post({
      _id: req.body.id,
      ...req.body,
    })
    post.imagePath = req.file ? getFilePathFromServer(req) : req.body.imagePath
    console.log(post)
    Post.updateOne({ _id: req.params.postId }, post).then((result) => {
      res.status(200).json({
        message: 'Update successful',
        post: result,
      })
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
    return Post.count().then(count => {
      console.log(docs)
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: docs,
        count
      })
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
