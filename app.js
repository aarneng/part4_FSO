const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const mongoose = require('mongoose')
const config = require("./utils/config")
const middleware = require('./utils/middleware')
const blogRouter = require("./controllers/blogs")
const userRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")


const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log("connected to mongoDB"))
  .catch((error) => console.log("an error occured while trying to connect to mongoDB:\n", error.message))


app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)

app.use("/api/blogs", blogRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app
