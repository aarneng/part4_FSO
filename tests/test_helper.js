const Note = require('../models/blogs')

const blogsInDB = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  blogsInDB
}