require('dotenv').config()

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/bloglist'
if (process.env.NODE_ENV === 'test') {
MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost/bloglist-test'
}
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3003

module.exports = {
  MONGODB_URI,
  HOST,
  PORT
}
