const express = require('express')
const eventproxy = require('eventproxy');
const superagent = require('superagent')
const cheerio = require('cheerio')
const url = require('url');

const app = express()
const hcUrl = 'https://nba.hupu.com/';

app.get('/', (req, res, next) => {
  superagent.get(hcUrl)
    .end((err, res) => {
      if(err) {
        return console.error(err)
      }

      let topicUrls = []
      let $ = cheerio.load(res.text)

      $('.nba-teamForum dd').slice(0, 4).find("a").each((index, ele) => {
        const $ele = $(ele)

        let href = url.resolve(hcUrl, $ele.attr("href"))

        topicUrls.push(href)
      })

      console.log(topicUrls)

      let ep = new eventproxy()

      ep.after('topic_html', topicUrls.length, (topics) => {
        topics = topics.map((topicPair) => {
          let topicUrl = topicPair[0]
          let topicHtml = topicPair[1]
          let $ = cheerio.load(topicHtml)
          return ({
            href: topicUrl,
            title: $('#j_data').attr("data-title"),
            comment1: $('#readfloor td').eq(0).text().trim()
          })
        })

        console.log(topics)
      })

      topicUrls.forEach((topicUrl) => {
        superagent.get(topicUrl)
          .end((err, sres) => {
            console.log('fetch' + topicUrl + 'successful')
            ep.emit('topic_html', [topicUrl, sres.text])
          })
      })
    })
})

app.listen(7777, () => {
  console.log('app is running at port 7777')
})
