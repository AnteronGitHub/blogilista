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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
