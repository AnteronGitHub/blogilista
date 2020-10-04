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

test('blog can be created', async () => {
  const blogObject = {
    title: 'zip',
    author: 'zap',
    url: 'http://example.com',
    likes: 11
  }
  let response = await api
    .post('/api/blogs')
    .send(blogObject)

  expect(response.body.title).toEqual(blogObject.title)
  expect(response.body.author).toEqual(blogObject.author)
  expect(response.body.url).toEqual(blogObject.url)
  expect(response.body.likes).toEqual(blogObject.likes)

  response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('blog can be created without likes specified', async () => {
  const blogObject = {
    title: 'zip',
    author: 'zap',
    url: 'http://example.com'
  }
  let response = await api
    .post('/api/blogs')
    .send(blogObject)

  expect(response.body.likes).toBe(0)

  response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('blog can not be created without title and author', async () => {
  const blogObject = {
    url: 'http://example.com'
  }
  let response = await api
    .post('/api/blogs')
    .send(blogObject)

  expect(response.statusCode).toBe(400)

  response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blog can be deleted', async () => {
  let response = await api.get('/api/blogs')
  const idToRemove = response.body[0].id
  await api
    .delete(`/api/blogs/${idToRemove}`)
    .expect(204)

  response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length - 1)
})

afterAll(() => {
  mongoose.connection.close()
})
