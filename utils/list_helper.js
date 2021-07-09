function dummy(blogs) {
  return 1
}

function totalLikes(blogs) {
  return blogs.reduce((a,b) => a + b.likes, 0)
}

function favouriteBlog(blogs) {
  if (!blogs.length) return null

  const mostLiked = blogs.reduce((a, b) => a.likes > b.likes ? a : b, blogs[0])
  return (({title, author, likes}) => ({title, author, likes}))(mostLiked)
}

function mostBlogs(blogs) {
  if (!blogs.length) return null

  let blogsAndAuthors = new Map()

  for (let i of blogs) {
    const author = i.author
    const blogs = blogsAndAuthors.get(author)
    blogsAndAuthors.set(author, typeof blogs !== "undefined" ? blogs + 1 : 1)
  }

  let maxBlogger = blogsAndAuthors.entries().next().value // first item

  for (let [key, val] of blogsAndAuthors) {
    if (val > maxBlogger[1]) maxBlogger = [key, val]
  }
  
  return {
    author: maxBlogger[0],
    blogs: maxBlogger[1]
  }

}

function mostLikes(blogs) {
  if (!blogs.length) return null

  let likesAndAuthors = new Map()

  for (let i of blogs) {
    const author = i.author
    const likes = i.likes
    const totalLikes = likesAndAuthors.get(author)
    likesAndAuthors.set(author, typeof totalLikes !== "undefined" ? totalLikes + likes : likes)
  }

  let maxBlogger = likesAndAuthors.entries().next().value // first item

  for (let [key, val] of likesAndAuthors) {
    if (val > maxBlogger[1]) maxBlogger = [key, val]
  }
  
  return {
    author: maxBlogger[0],
    likes: maxBlogger[1]
  }

}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}