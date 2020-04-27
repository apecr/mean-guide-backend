const Post = require('./../models/post')

const getFilePathFromServer = (req) => {
  const urlPath = `${req.protocol}://${req.get('host')}`
  return `${urlPath}/images/${req.file.filename}`
}

const createPost = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: getFilePathFromServer(req),
    creator: req.userData.userId,
  })
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...result,
          id: result._id,
        },
      })
    })
    .catch(() =>
      res.status(500).json({ message: 'Creating a post failed!' })
    )
}

const editPost = (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    ...req.body,
    creator: req.userData.userId,
  })
  post.imagePath = req.file ? getFilePathFromServer(req) : req.body.imagePath
  Post.updateOne(
    { _id: req.params.postId, creator: req.userData.userId },
    post
  )
    .then((result) => {
      if (result.n > 0) {
        return res.status(200).json({
          message: 'Update successful',
          post: result,
        })
      }
      res.status(401).json({ message: 'Not Authorized to update the post' })
    })
    .catch(() =>
      res.status(500).json({ message: 'Updating a post failed!' })
    )
}

const getPost = (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      if (post) {
        return res.status(200).json(post)
      }
      return res.status(404).json({ message: 'Post not found' })
    })
    .catch(() => res.status(500).json({ message: 'Geting a post failed!' }))
}

const getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize
  const currentPage = +req.query.page
  const postQuery = Post.find()
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
  }
  postQuery
    .then((docs) => {
      return Post.estimatedDocumentCount().then((count) => {
        res.status(200).json({
          message: 'Posts fetched successfully',
          posts: docs,
          count,
        })
      })
    })
    .catch(() => res.status(500).json({ message: 'Fetching posts failed!' }))
}

const deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        return res.status(200).json({
          message: `Post ${req.params.id} deleted`,
          id: result._id,
        })
      }
      res.status(401).json({ message: 'Not Authorized to delete the post' })
    })
    .catch(() => res.status(500).json({ message: 'Deleting a post failed!' }))
}

module.exports = {
  createPost,
  editPost,
  getPost,
  getPosts,
  deletePost
}