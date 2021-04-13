const db = require('./myApp')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const dns = require('dns')
let mongoose
try {
  mongoose = require('mongoose')
} catch (error) {
  console.log(error)
}

app.use(cors())
// Basic Configuration
const port = process.env.PORT || 3000

app.use('/public', express.static(`${process.cwd()}/public`))

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

app.post('/api/shorturl/new', (req, res) => {
  const { url } = req.body
  const regex = /^https*:[^a-z0-9]*www./
  const secondRegex = /^https*:\/\//

  if (secondRegex.test(url)) {
    const shortUrl = db.getUniqueNumber()
    db.createAndSaveUrl(url, shortUrl, (err, data) => {
      if (err) console.log(err)
      res.json({ original_url: `${url}`, short_url: shortUrl })
    })
  } else if (regex.test(url)) {
    const correctUrl = url.substring(url.match(regex)[0].length)
    dns.lookup(correctUrl, (err, address, family) => {
      if (err) {
        res.json({ error: err.code })
      } else {
        const shortUrl = db.getUniqueNumber()
        db.createAndSaveUrl(url, shortUrl, (err, data) => {
          if (err) console.log(err)
          res.json({ original_url: `${url}`, short_url: shortUrl })
        })
      }
    })
  } else {
    res.json({ error: 'invalid url' })
  }
})
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const { shortUrl } = req.params
  db.checkShortUrl(shortUrl, (err, data) => {
    if (err) console.log(err)
    const { original_url } = data
    res.redirect(original_url)
  })
})
app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
