const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })

  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (body.password.length < 3) {
    response.status(400).json({
      error: 'Password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  new User({ username: body.username, name: body.name, passwordHash })
    .save()
    .then(result => response.status(201).json(result))
    .catch(error => next(error))
})

module.exports = usersRouter
