const blogRouter = require('express').Router()
const Blog = require("../models/blogs")
const User = require("../models/users")
const jwt = require("jsonwebtoken")
const logger = require("../utils/logger")
const middleware = require("./../utils/middleware")


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {username: 1, name: 1})

  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {

  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  // if (!decodedToken.id) {
  //   return response.status(401).json({error: "missing or invalid token"})
  // }

  const user = request.user

  const b = request.body
  const blog = new Blog ({
    title: b.title,
    url: b.url,
    author: b.author,
    likes: b.likes || 0,
    user: user
  })

  const res = await blog.save()

  user.blogs = user.blogs.concat(res)
  await user.save()

  response.json(res)
})

blogRouter.delete("/:id", middleware.userExtractor, async (request, response) => {

  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  // if (!decodedToken.id) {
  //   return response.status(401).json({error: "missing or invalid token"})
  // }

  const blog = await Blog.findById(request.params.id)
  const user = request.user
  user.blogs = user.blogs.filter(b => b.id.toString() != blog.id.toString())
  await user.save()
  await blog.remove()
  response.status(204).end()
})

blogRouter.put("/:id", async (request, response, next) => {
  const blog = {
    title: request.body.title,
    url: request.body.url,
    likes: request.body.likes || 0,
    author: request.body.author
  }

  Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    .then(updated => response.json(updated.toJSON()))
    .catch(e => next(e))
})

module.exports = blogRouter

