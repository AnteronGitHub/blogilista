const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs.map(b => b.toJSON()))
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog
    .findByIdAndRemove(request.params.id)
    .then(blogs => {
      response.status(204).json(blogs)
    })
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const person = {
    likes: body.likes
  }

  Blog.findByIdAndUpdate(
    request.params.id,
    person,
    {
      new: true,
      runValidators: true,
      context: 'query'
    })
    .then(updatedBlog => response.json(updatedBlog))
    .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const body = request.body

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog.toJSON())
})

module.exports = blogsRouter
