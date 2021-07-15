const logger = require("./logger")
const jwt = require("jsonwebtoken")
const User = require("../models/users")


function requestLogger(request, response, next) {
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("Body:  ", request.body)
  logger.info("-".repeat(20))
  next()
}

function errorHandler(error, request, response, next) {
  logger.error(error.name, error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" })
  }
  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

function tokenExtractor(request, response, next) {
  const auth = request.get("authorization")

  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    request.token = auth.substring(7)
  }

  next()
}

async function userExtractor(request, response, next) {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({error: "missing or invalid token"})
  }

  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {
  requestLogger,
  errorHandler,
  tokenExtractor,
  userExtractor
}