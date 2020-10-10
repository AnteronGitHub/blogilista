const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
  {
    username: 'foo',
    name: 'foo',
    passwordHash: 'secret'
  },
  {
    username: 'bar',
    name: 'bar',
    passwordHash: 'secret'
  }
]

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await User.insertMany(initialUsers)
  const users = await User.find({})
  await Blog.insertMany(initialBlogs
    .map((blog, i) => ({ ...blog, user: users[i % users.length].id })))
})

describe('Without authentication', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')

    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toContain('application/json')
    expect(response.body).toHaveLength(initialBlogs.length)
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })

  test('blog cannot be created', async () => {
    const blogObject = {
      title: 'zip',
      author: 'zap',
      url: 'http://example.com',
      likes: 11
    }
    const response = await api.post('/api/blogs').send(blogObject)

    expect(response.statusCode).toBe(401)
    expect(response.body.error).toEqual('invalid token')
  })

  test('blog can not be deleted', async () => {
    let response = await api.get('/api/blogs')
    const idToRemove = response.body[0].id
    response = await api.delete(`/api/blogs/${idToRemove}`)

    expect(response.statusCode).toBe(401)
  })

  test('blog can not be updated', async () => {
    let response = await api.get('/api/blogs')
    const idToUpdate = response.body[0].id
    response = await api
      .put(`/api/blogs/${idToUpdate}`)
      .send({ likes: 99 })

    expect(response.statusCode).toBe(401)
  })
})

describe('With authentication', () => {
  test('blog can be created', async () => {
    const user = await User.findOne({})

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const TOKEN = jwt.sign(userForToken, process.env.SECRET)

    const blogObject = {
      title: 'zip',
      author: 'zap',
      url: 'http://example.com',
      likes: 11
    }
    let response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(blogObject)

    expect(response.statusCode).toBe(201)
    expect(response.body.title).toEqual(blogObject.title)
    expect(response.body.author).toEqual(blogObject.author)
    expect(response.body.url).toEqual(blogObject.url)
    expect(response.body.likes).toEqual(blogObject.likes)

    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })

  test('blog can be created without likes specified', async () => {
    const user = await User.findOne({})

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const TOKEN = jwt.sign(userForToken, process.env.SECRET)

    const blogObject = {
      title: 'zip',
      author: 'zap',
      url: 'http://example.com'
    }
    let response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(blogObject)

    expect(response.statusCode).toBe(201)
    expect(response.body.likes).toBe(0)

    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })

  test('blog can not be created without title and author', async () => {
    const user = await User.findOne({})

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const TOKEN = jwt.sign(userForToken, process.env.SECRET)

    const blogObject = {
      url: 'http://example.com'
    }
    let response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(blogObject)

    expect(response.statusCode).toBe(400)

    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blog can be deleted', async () => {
    const user = await User.findOne({})

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const TOKEN = jwt.sign(userForToken, process.env.SECRET)

    let response = await api.get('/api/blogs')
    const idToRemove = response.body[0].id
    await api
      .delete(`/api/blogs/${idToRemove}`)
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(204)

    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length - 1)
  })

  test('blog can be updated', async () => {
    const user = await User.findOne({})

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const TOKEN = jwt.sign(userForToken, process.env.SECRET)

    let response = await api.get('/api/blogs')
    const idToUpdate = response.body[0].id
    await api
      .put(`/api/blogs/${idToUpdate}`)
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ likes: 99 })
      .expect(200)

    response = await api.get('/api/blogs')
    expect(response.body.find(blog => blog.id === idToUpdate).likes).toBe(99)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
