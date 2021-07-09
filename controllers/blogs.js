const blogRouter = require('express').Router()
const Blog = require("../models/blogs")

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const b = request.body

  const blog = new Blog ({
    title: b.title,
    url: b.url,
    author: b.author,
    likes: b.likes || 0
  })
  
  const res = await blog.save()
  
  response.json(res.toJSON())

})

blogRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
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

