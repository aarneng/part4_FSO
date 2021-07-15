const loginRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/users")

loginRouter.post("/", async (request, response)  => {
  const body = request.body
  const user = await User.findOne({username: body.username})

  const loginSuccessful = user === null 
    ? false
    : await bcrypt.compare(body.password, user.hashedPassword)
  
  if (!loginSuccessful || !user) {
    return response.status(401).json({error: "bad password"})
  }
  
  const userObjForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userObjForToken, process.env.SECRET, {expiresIn: 7*24*60*60})

  response.status(201)
    .send({token, username: user.username, name: user.name})
})


module.exports = loginRouter
