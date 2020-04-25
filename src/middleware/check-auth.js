const jwt = require('jsonwebtoken')

const secretJWT = process.env.JWT_SECRET

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretJWT)
    req.userData = { email: decodedToken.email, userId: decodedToken.userId }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'You are not authenticated', error })
  }
}
