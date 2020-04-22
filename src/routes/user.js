const express = require('express')
const bcrypt = require('bcrypt')
const User = require('./../models/user')

const router = new express.Router()

router.post('/signup', async(req, res, next) => {
  const hashPassword = await   bcrypt.hash(req.body.password, 10)
  const user = new User({
    email: req.body.email,
    password: hashPassword
  })
  return user.save()
    .then(result => {
      res.status(201).json({
        message: 'User created',
        user: result
      })
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

module.exports = router