const dummy = blogs => {
  return 1
}

const totalLikes = blogs =>
  blogs
    .map(blog => blog.likes)
    .reduce((l1, l2) => l1 + l2, 0)

module.exports = {
  dummy,
  totalLikes
}
