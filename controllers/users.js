const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', (request, response, next) => {
  User
    .find({})
    .then(users => {
      response.json(users)
    })
    .catch(error => next(error))
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  new User({ username: body.username, name: body.name, passwordHash })
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

module.exports = usersRouter
