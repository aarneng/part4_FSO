/* eslint-disable no-undef */
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")

const api = supertest(app)

const User = require("../models/users")

const initialUsers = [
  {
    "blogs":[],
    "username":"test",
    "name":"test man",
    "id":"46115c69cfd39ecf2436087d"
  },
  {
    "blogs":[],
    "username":"batman",
    "name":"bruce wayne",
    "id":"60e8aacae63ae50fcc250730"
  },
  {
    "blogs":[],
    "username":"aarnenf",
    "name":"Aarni Haapaniemi",
    "id":"645dea1846e63cf0d98c43bd"
  },
]

beforeEach(async () => {
  await User.deleteMany({})
  for (let user of initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  }
})

test("users are returned as JSON", async () => {
  await api
    .get("/api/users")
    .expect(200)
    .expect("content-type", /application\/json/)
})

test("there's N users", async () => {
  const response = await api.get("/api/users")
  // console.log(response)
  expect(response.body).toHaveLength(initialUsers.length)
})

test("the first user is a test user", async () => {
  const response = await api.get("/api/users")

  // console.log(response.body)
  expect(response.body[0].username).toBe("test")
})

test("a valid user can be added", async () => {
  const newUser = {
    "blogs": [],
    "username":"not_batman",
    "name":"Wruce Bayne",
    "id":"817702f138da67ec49cf6eb9"
  }

  await api.post("/api/users")
    .send(newUser)
    .expect(200)
    .expect("content-type", /application\/json/)
  
  const response = await api.get("/api/users")

  const usernames = response.body.map(r => r.username)

  expect(response.body).toHaveLength(initialUsers.length + 1)
  expect(usernames).toContain(
    newUser.username
  )
})

test("the unique property is named id", async () => {
  const users = await api.get("/api/users")
  
  for (let user of users.body)  {
    expect(user.id).toBeDefined()
  }
})

test("the field _id is undefined", async () => {
  const users = await api.get("/api/users")

  for (let user of users.body)  {
    expect(user._id).toBeUndefined()
  }
})

test("unspecified username and/or password respond with status 400", async () => {
  const newUserusernameMissing = {
    "blogs": [],
    "name":"Wruce Bayne",
    "id":"817702f138da67ec49cf6eb9"
  }

  const usersBefore = await api.get("/api/users")

  await api.post("/api/users")
    .send(newUserusernameMissing)
    .expect(400)

  const newUserURLMissing = {
    username: "new user",
    author: "developer man",
    likes: Infinity
  }

  await api.post("/api/users")
    .send(newUserURLMissing)
    .expect(400)
  
  const usersLater = await api.get("/api/users")
  expect(usersLater).toBe(usersBefore)
})

test("deleting a user post works", async () => {
  const notesAtStart = await helper.usersInDB()
  const toDelete = notesAtStart[0]
  
  await api
    .delete(`/api/users/${toDelete.id}`)
    .expect(204)
  // await api.delete(`/api/users/${toDelete.id}`)
  
  const notesAtEnd = await helper.usersInDB()

  expect(notesAtEnd).toHaveLength(notesAtStart.length - 1)

  const usernames = notesAtEnd.map(r => r.username)
  expect(usernames[0]).not.toContain(toDelete.username)
})

test("updating a user post works", async () => {
  const newUser = {
    username: "new user",
    author: "developer man",
    url: "localhost",
    likes: Infinity
  }

  const notesAtStart = await helper.usersInDB()
  const toUpdate = notesAtStart[0]
  await api.put(`/api/users/${toUpdate.id}`)
    .send(newUser)
    .expect(200)
  
  const notesAtEnd = await helper.usersInDB()

  expect(notesAtEnd).toHaveLength(notesAtStart.length)

  expect(notesAtStart[0].username).not.toBe(notesAtEnd[0].username)
})



afterAll(() => {
  mongoose.connection.close()
})


