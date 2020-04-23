const jwt = require('jsonwebtoken')

const secretJWT = process.env.JWT_SECRET

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, secretJWT)
    next()
  } catch (error) {
    return res.status(401).json({message: 'Auth failed', error})
  }
}