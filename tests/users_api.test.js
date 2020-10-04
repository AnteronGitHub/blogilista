const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const User = require('../models/user')
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

beforeEach(async () => {
  await User.deleteMany({})
  const userObjects = initialUsers.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

const api = supertest(app)

test('users are returned as json', async () => {
  const response = await api.get('/api/users')

  expect(response.body.length).toBe(2)
})

test('usernames are unique', async () => {
  const response = await api
    .post('/api/users')
    .send({username: 'foo', password: 'bar'})

  expect(response.statusCode).toBe(400)
})

test('usernames cannot be under 3 characters long', async () => {
  const response = await api
    .post('/api/users')
    .send({username: 'fo', password: 'bar'})

  expect(response.statusCode).toBe(400)
})

test('passwords cannot be under 3 characters long', async () => {
  const response = await api
    .post('/api/users')
    .send({username: 'biz', password: 'ni'})

  expect(response.statusCode).toBe(400)
})

afterAll(() => {
  mongoose.connection.close()
})
