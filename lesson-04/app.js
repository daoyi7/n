const express = require('express')
const eventproxy = require('eventproxy');
const superagent = require('superagent')
const cheerio = require('cheerio')
const url = require('url');

const app = express()
const cnodeUrl = 'https://cnodejs.org/';

app.get('/', (req, res, next) => {
  superagent.get(cnodeUrl)
    .end((err, res) => {
      if(err) {
        return console.error(err)
      }

      let topicUrls = []
      let $ = cheerio.load(res.text)

      $('#topic_list .topic_title').each((index, ele) => {
        const $ele = $(ele)

        let href = url.resolve(cnodeUrl, $ele.attr('href'))

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
            title: $('.topic_full_title').text().trim(),
            href: topicUrl,
            comment1: $('.reply_content').eq(0).text().trim()
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
