const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogsRoute = require('./controllers/blogs')
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

app.use('/api/blogs', blogsRoute)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
