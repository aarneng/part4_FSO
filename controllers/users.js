const bcrypt = require("bcrypt")
const userRouter = require("express").Router()
const User = require("../models/users")

userRouter.post("/", async (request, response) => {
  const body = request.body

  if (!body.username || body.username.length < 3) {
    return response.status(400).json({error: "username missing"})
  }
  if (!body.password || body.password.length < 3) {
    return response.status(400).json({error: "password missing"})
  }
  
  const saltedRounds = 10
  const hashedPassword = await bcrypt.hash(body.password, saltedRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    hashedPassword
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {title: 1, url: 1, author: 1, likes: 1})

  response.json(users)
})

module.exports = userRouter
