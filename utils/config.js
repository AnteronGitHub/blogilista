require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/bloglist'
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3003

module.exports = {
  MONGODB_URI,
  HOST,
  PORT
}
