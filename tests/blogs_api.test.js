const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const initialBlogs = [
  {
    title: 'foo',
    author: 'bar',
    url: 'http://example.com',
    likes: 1
  },
  {
    title: 'biz',
    author: 'niz',
    url: 'http://example.com',
    likes: 2
  }
]
beforeEach(async () => {
  await Blog.deleteMany({})
  initialBlogs.forEach(async blog => {
    await new Blog(blog).save()
  })
})

const api = supertest(app)

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
  expect(response.statusCode).toBe(200)
  expect(response.header['content-type']).toContain('application/json')
})

test('blog entries contain proper id field', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
