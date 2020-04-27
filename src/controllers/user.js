const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./../models/user')

const secretJWT = process.env.JWT_SECRET

const loginErrorOutput = {message: 'Invalid authentication credentials!'}

const generateToken = (user) => ({
  token: jwt.sign({ email: user.email, userId: user._id }, secretJWT, {
    expiresIn: '1h',
  }),
  expiresIn: 3600,
  userId: user._id
})

const createUser = async(req, res, next) => {
  const hashPassword = await bcrypt.hash(req.body.password, 10)
  const user = new User({
    email: req.body.email,
    password: hashPassword,
  })
  return user
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'User created',
        ...generateToken(result)
      })
    })
    .catch((error) => res.status(500).json(loginErrorOutput))
}

const login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(async(user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed',
        })
      }
      try {
        const result = await bcrypt.compare(req.body.password, user.password)
        if (!result) {
          return res.status(401).json(loginErrorOutput)
        }
        return res.status(200).json({
          message: 'Auth ok',
          ...generateToken(user)
        })
      } catch (error) {
        console.log(error)
        return res.status(500).json(error)
      }
    })
    .catch((error) => res.status(500).json(loginErrorOutput))
}

module.exports = {
  createUser,
  login
}