/* eslint-disable no-undef */
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")
const bcrypt = require("bcrypt")

const api = supertest(app)

const Blog = require("../models/blogs")
const User = require("../models/users")

// const initialUsers = [
//   {
//     "username": "test man",
//     "name": "admin",
//     "password": "swag of chicken"
//   },
//   {
//     "username": "the cooler test man",
//     "name": "super admin",
//     "password": "1234567891011121314151617181920"
//   }
// ]

const initialUser = {
  "username": "test man",
  "name": "admin",
  "password": "swag of chicken"
}
let user = {}
let tokenObj = {}

const initialBlogs = [
  {
    "title": "test",
    "author": "69696969",
    "url": "batman",
    "likes": 69
  },
  {
    "title": "longNameMan",
    "author": "69696969",
    "url": "batman",
    "likes": 69
  },
  {
    "title": "rest man",
    "author": "69696969",
    "url": "batman",
    "likes": 69
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // let finalUsers = []

  // for (let i = 0; i < initialUsers.length; i++) {
  //   const user = initialUsers[i]
  //   const saltedRounds = 10
  //   const hashedPassword = await bcrypt.hash(user.password, saltedRounds)
  //   const finalUser = new User({
  //     username: user.username,
  //     name: user.name,
  //     hashedPassword
  //   })
  //   await finalUser.save()
  //   finalUsers.concat(finalUser)
  // }
  const saltedRounds = 10
  const hashedPassword = await bcrypt.hash(initialUser.password, saltedRounds)
  user = new User({
      username: initialUser.username,
      name: initialUser.name,
      hashedPassword
  })
  await user.save()

  tokenObj = await api.post("/api/login").send(initialUser)

  for (let blog of initialBlogs) {
    
    blog.user = user
    let blogObject = new Blog(blog)
    await blogObject.save()

    user.blogs = user.blogs.concat(blogObject)
    await user.save()
  }
})

test("blogs are returned as JSON", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("content-type", /application\/json/)
})

test("there's N blogs", async () => {
  const response = await api.get("/api/blogs")
  // console.log(response)
  expect(response.body).toHaveLength(initialBlogs.length)
})

test("the first blog is a test blog", async () => {
  const response = await api.get("/api/blogs")

  // console.log(response.body)
  expect(response.body[0].title).toBe("test")
})

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "new blog",
    author: "developer man",
    url: "localhost",
    likes: Infinity
  }
  await api
    .post("/api/blogs")
    .set({Authorization: "Bearer " + tokenObj.body.token})
    .send(newBlog)
    .expect(200)
    .expect("content-type", /application\/json/)
  
  const response = await api.get("/api/blogs")

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(
    newBlog.title
  )
})

test("the unique property is named id", async () => {
  const blogs = await api.get("/api/blogs")
  
  for (let blog of blogs.body)  {
    expect(blog.id).toBeDefined()
  }
})

test("the field _id is undefined", async () => {
  const blogs = await api.get("/api/blogs")

  for (let blog of blogs.body)  {
    expect(blog._id).toBeUndefined()
  }
})

test("unspecified likes default to 0", async () => {
  const newBlogLikesMissing = {
    title: "new blog",
    author: "developer man",
    url: "localhost"
  }

  await api.post("/api/blogs")
    .send(newBlogLikesMissing)
  
  const response = await api.get("/api/blogs")

  for (let blog of response.body) {
    if (blog.title === newBlogLikesMissing.title) expect(blog.likes).toBe(0)
  }
  
})

test("unspecified title and/or URL respond with status 400", async () => {
  const newBlogTitleMissing = {
    author: "developer man",
    url: "localhost",
    likes: Infinity
  }

  await api
    .post("/api/blogs")
    .set({Authorization: "Bearer " + tokenObj.body.token})
    .send(newBlogTitleMissing)
    .expect(400)

  const newBlogURLMissing = {
    title: "new blog",
    author: "developer man",
    likes: Infinity
  }

  await api
    .post("/api/blogs")
    .set({Authorization: "Bearer " + tokenObj.body.token})
    .send(newBlogURLMissing)
    .expect(400)
})

test("deleting a blog post works", async () => {
  const notesAtStart = await helper.blogsInDB()
  const toDelete = notesAtStart[0]
  
  await api
    .delete(`/api/blogs/${toDelete.id}`)
    .set({Authorization: "Bearer " + tokenObj.body.token})
    .expect(204)
  // await api.delete(`/api/blogs/${toDelete.id}`)
  
  const notesAtEnd = await helper.blogsInDB()

  expect(notesAtEnd).toHaveLength(notesAtStart.length - 1)

  const titles = notesAtEnd.map(r => r.title)
  expect(titles[0]).not.toContain(toDelete.title)
})

test("updating a blog post works", async () => {
  const newBlog = {
    title: "new blog",
    author: "developer man",
    url: "localhost",
    likes: Infinity
  }

  const notesAtStart = await helper.blogsInDB()
  const toUpdate = notesAtStart[0]
  await api.put(`/api/blogs/${toUpdate.id}`)
    .send(newBlog)
    .expect(200)
  
  const notesAtEnd = await helper.blogsInDB()

  expect(notesAtEnd).toHaveLength(notesAtStart.length)

  expect(notesAtStart[0].title).not.toBe(notesAtEnd[0].title)
})



afterAll(() => {
  mongoose.connection.close()
})

