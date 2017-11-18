const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')

const app = express()

app.get('/', (req, res, next) => {
  superagent.get('https://www.v2ex.com/')
    .end((err, sres) => {
      if(err) {
        return next(err)
      }

      const $ = cheerio.load(sres.text)
      let items = []

      $('#Main .item_title a').each((idx, element) => {
        let $ele = $(element)

        items.push({
          title: $ele.text()
        })
      })

      res.send(items)
    })
})

app.listen(7777, () => {
  console.log('app is running at port 7777')
})
