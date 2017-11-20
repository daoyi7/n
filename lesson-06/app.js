const express = require('express')
const cheerio = require('cheerio')
const url = require('url');
const superagent = require('superagent')
const async = require('async')

const app = express()

app.listen(7777, () => {
  console.log('app is running at port 7777')
})

const hcUrl = 'https://nba.hupu.com/';

app.get('/', (req, res, next) => {
  superagent.get(hcUrl)
    .end((err, sres) => {
      if(err) {
        return console.log(err)
      }

      let topicUrls = []
      let $ = cheerio.load(sres.text)

      $('.nba-teamForum dd').find("a").slice(0, 4).each((index, ele) => {
        const $ele = $(ele)

        let href = url.resolve(hcUrl, $ele.attr("href"))

        topicUrls.push(href)
      })

      let concurrencyCount = 0

      const fetchUrl = (link, callback) => {

        let delay = parseInt((Math.random() * 10000000) % 2000, 10)
        concurrencyCount++
        console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', link, '，耗时' + delay + '毫秒')

        setTimeout(() => {
          concurrencyCount--

          callback(null, link)
        }, delay)
      }

      async.mapLimit(topicUrls, 2, (link, callback) => {
        fetchUrl(link, callback)
      }, (err, result) => {
        console.log('over')
        res.send(result)
        let aa = result.map((topicPair) => {
          let $ = cheerio.load(topicPair[1])

          console.log(topicPair[1])
          return ({
            href: topicPair,
            title: $('#j_data').attr("data-title"),
            first_comment: $('#readfloor td').eq(0).text().trim()
          })
        })
        console.log(aa)
        // result.map((t) => {
        //   superagent.get(t)
        //     .end((err, sres) => {
        //       let $ = cheerio.load(sres.text)
        //       let ta = []
        //
        //       ta.push({
        //         href: t,
        //         title: $('#j_data').attr("data-title")
        //       })
        //       console.log(ta)
        //     })
        // })
      })
    })
})
