const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./../models/user')

const secretJWT = process.env.JWT_SECRET

const router = new express.Router()

const generateToken = (user) => ({
  token: jwt.sign({ email: user.email, userId: user._id }, secretJWT, {
    expiresIn: '1h',
  }),
  expiresIn: 3600,
})

router.post('/signup', async(req, res, next) => {
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
    .catch((error) => res.status(500).json(error))
})

router.post('/login', (req, res, next) => {
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
          return res.status(401).json({
            message: 'Auth failed',
          })
        }
        const {token, expiresIn} = generateToken(user)
        return res.status(200).json({
          message: 'Auth ok',
          token,
          expiresIn
        })
      } catch (error) {
        console.log(error)
        return res.status(500).json(error)
      }
    })
    .catch((error) => res.status(500).json(error))
})

module.exports = router
