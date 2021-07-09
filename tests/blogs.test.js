const listHelper = require('../utils/list_helper')
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe("test blogs in list", () => {
  test('total likes', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })

})

describe("test favourite blog", () => {
  test('total likes full list', () => {
    const expected = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual(expected)
  })

  test('total likes 0 item', () => {
    const expected = null
    const result = listHelper.favouriteBlog([])
    expect(result).toEqual(expected)
  })

  test('total likes 1 item', () => {
    const expected = {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7
    }
    const result = listHelper.favouriteBlog(blogs.slice(0, 1))
    expect(result).toEqual(expected)
  })

  test('total likes 2 item', () => {
    const expected = {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7
    }
    const result = listHelper.favouriteBlog(blogs.slice(0, 2))
    expect(result).toEqual(expected)
  })
})

describe("test most blogs written", () => {
  test('total likes full list', () => {
    const expected = {
      author: "Robert C. Martin",
      blogs: 3
    }
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(expected)
  })

  test('total likes 0 item', () => {
    const expected = null
    const result = listHelper.mostBlogs([])
    expect(result).toEqual(expected)
  })

  test('total likes 1 item', () => {
    const expected = {
      author: "Michael Chan",
      blogs: 1
    }
    const result = listHelper.mostBlogs(blogs.slice(0, 1))
    expect(result).toEqual(expected)
  })

  test('total likes 2 item', () => {
    const acceptableAnswers = [
      {
        author: "Michael Chan",
        blogs: 1
      }, {
        author: "Edsger W. Dijkstra",
        blogs: 1
      }
    ]
    const result = listHelper.mostBlogs(blogs.slice(0, 2))
    const contained = acceptableAnswers.some(acceptableAnswer => 
      acceptableAnswer["author"] === result["author"] && 
      acceptableAnswer["blogs"]  === result["blogs"]
    )
    expect(contained).toEqual(true)
  })
})

describe("test most likes received", () => {
  test('total likes full list', () => {
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(expected)
  })

  test('total likes 0 item', () => {
    const expected = null
    const result = listHelper.mostLikes([])
    expect(result).toEqual(expected)
  })

  test('total likes 1 item', () => {
    const expected = {
      author: "Michael Chan",
      likes: 7
    }
    const result = listHelper.mostLikes(blogs.slice(0, 1))
    expect(result).toEqual(expected)
  })

  test('total likes 2 item', () => {
    const expected = {
      author: "Michael Chan",
      likes: 7
    }
    const result = listHelper.mostLikes(blogs.slice(0, 2))
    expect(result).toEqual(expected)
  })
})
