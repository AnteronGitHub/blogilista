const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs =>
  blogs
    .map(blog => blog.likes)
    .reduce((l1, l2) => l1 + l2, 0)

const favoriteBlog = blogs => {
  if (blogs.length === 0 ) {
    return undefined
  }
  let favorite = blogs[0]
  blogs.forEach(blog => {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  })
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return undefined
  }
  let grouped = _.groupBy(blogs, blog => blog.author)
  grouped = Object.keys(grouped).map(key => {
    return {
      author: key,
      blogs: grouped[key].length
    }
  })

  most = grouped[0]
  grouped.forEach(item => {
    if (item.blogs > most.blogs) {
      most = item
    }
  })

  return most
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return undefined
  }
  let grouped = _.groupBy(blogs, blog => blog.author)
  grouped = Object.keys(grouped).map(key => {
    return {
      author: key,
      likes: totalLikes(grouped[key])
    }
  })

  most = grouped[0]
  grouped.forEach(item => {
    if (item.likes > most.likes) {
      most = item
    }
  })

  return most
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
