const express = require('express')
const eventproxy = require('eventproxy');
const superagent = require('superagent')
const cheerio = require('cheerio')
const url = require('url');

const app = express()
const v2Url = 'https://www.v2ex.com/';

app.get('/', (req, res, next) => {
  superagent.get(v2Url)
    .end((err, res) => {
      if(err) {
        return console.error(err)
      }

      let topicUrls = []
      let $ = cheerio.load(res.text)

      $('#Main .item_title a').each((index, ele) => {
        const $ele = $(ele)

        let href = url.resolve(v2Url, $ele.attr('href'))

        topicUrls.push(href)
      })

      console.log(topicUrls.length)

      var ep = new eventproxy()

      ep.after('topic_html', topicUrls.length, (topics) => {
        topics = topics.map((topicPair) => {
          let topicUrl = topicPair[0]
          let topicHtml = topicPair[1]
          let $ = cheerio.load(topicHtml)
          return ({
            href: topicUrl,
            title: $('.header h1').text(),
            comment1: $('.reply_content').eq(0).text()
          })
        })

        console.log(topics)
      })

      topicUrls.forEach((topicUrl) => {
        superagent.get(topicUrl)
          .end((err, res) => {
            console.log('fetch' + topicUrl + 'successful')
            ep.emit('topic_html', [topicUrl, res.text])
          })
      })
    })
})

app.listen(7777, () => {
  console.log('app is running at port 7777')
})
