const blogRouter = require('express').Router()
const Blog = require("../models/blogs")
// const User = require("../models/users")
// const jwt = require("jsonwebtoken")
// const logger = require("../utils/logger")
const middleware = require("./../utils/middleware")


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {username: 1, name: 1})

  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {

  const user = request.user
  const blog = new Blog (request.body)

  blog.likes = blog.likes || 0
  blog.user = user

  const res = await blog.save()

  // console.log("user", "\n", "------------------------", "\n")
  // console.log(user)
  // console.log("blog", "\n", "------------------------", "\n")
  // console.log(blog)
  // console.log("response", "\n", "------------------------", "\n")
  // console.log(res)

  // delete res.__v

  const id = await res._id
  // console.log("IDS ARE THE SAME?", id == res._id)
  // console.log("IDS ARE NOT THE SAME?", id == user._id)
  
  // sleep(2000)

  user.blogs = user.blogs.concat(id)
  await user.update()

  response.status(201).json(res)
})

blogRouter.delete("/:id", middleware.userExtractor, async (request, response) => {

  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  // if (!decodedToken.id) {
  //   return response.status(401).json({error: "missing or invalid token"})
  // }

  const blog = await Blog.findById(request.params.id)
  const user = request.user
  console.log(blog, user)
  if (!blog || !user) return response.status(404)

  user.blogs = user.blogs.filter(b => b.id.toString() != blog.id.toString())
  await user.save()
  await blog.remove()
  response.status(204).end()
})

blogRouter.put("/:id", async (request, response, next) => {
  const blog = request.body
  // console.log(request.params.id, blog)
  Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    .then(updated => response.json(updated.toJSON()))
    .catch(e => next(e))
})

module.exports = blogRouter

