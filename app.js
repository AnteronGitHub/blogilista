const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogsRoute = require('./controllers/blogs')
const loginRoute = require('./controllers/login')
const usersRoute = require('./controllers/users')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

mongoose.connect(
  config.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRoute)
app.use('/api/login', loginRoute)
app.use('/api/users', usersRoute)

if(process.env.NODE_ENV == 'test') {
  const testingRouter = require('./controllers/testing')

  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
