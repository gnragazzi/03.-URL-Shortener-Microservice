require('dotenv').config()
const mongoose = require('mongoose')
const { Schema } = mongoose

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log(`we're connected`)
})

const urlSchema = new Schema({
  original_url: String,
  short_url: Number,
})

let UserUrls = mongoose.model('UserUrls', urlSchema)

const createAndSaveUrl = (originalUrl, shortUrl, done) => {
  const newUrl = new UserUrls({
    original_url: originalUrl,
    short_url: shortUrl,
  })
  newUrl.save((err, data) => {
    if (err) return console.error(err)
    done(null, data)
  })
}

const checkShortUrl = (shortUrl, done) => {
  UserUrls.findOne({ short_url: shortUrl }, (err, data) => {
    if (err) return console.error(err)
    done(null, data)
  })
}

const getUniqueNumber = () => {
  let i = Math.floor(Math.random() * 99999)
  return i
}

exports.createAndSaveUrl = createAndSaveUrl
exports.checkShortUrl = checkShortUrl
exports.getUniqueNumber = getUniqueNumber
