const async = require('async')
const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')
const eventproxy = require('eventproxy');
const url = require('url')
const hc = 'https://voice.hupu.com/nba'

const app = express()
app.listen(7777, () => {
  console.log(7777)
})

app.get('/', (req, res, next) => {
  superagent.get(hc)
    .end((err, sres) => {
      if (err) {
        console.error(err)
      }

      const $ = cheerio.load(sres.text)
      let urls = []

      $(".news-list li").each((idx, ele) => {
        const $ele = $(ele)

        if (typeof($ele.attr("class")) == "undefined") {
          const href = $ele.find("h4 a").attr("href")

          urls.push(href)
        }
      })

      let concurrencyCount = 0

      const fetchUrl = (url, callback) => {
        let delay = parseInt((Math.random() * 10000000) % 2000, 10)

        concurrencyCount++

        console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒')

        setTimeout(() => {

          concurrencyCount--

          superagent.get(url)
            .end((err, sres) => {
              if(err) {
                console.error("我要看这个："+err)
              }

              let $ = cheerio.load(sres.text)

              callback (null, {
                href: url,
                id: url.split("").slice(27,34).join(""),
                title: $('.headline').text().trim(),
                upTime: $(".artical-info a.time span").eq(0).text().trim(),
                source: $(".comeFrom a").eq(0).text().trim(),
                thumb: $('.artical-importantPic img').eq(0).attr("src"),
                info: $('.artical-main-content p').eq(0).text().trim()
              })
            })

          // callback(null,url)
        }, delay)
      }

      async.mapLimit(urls, 5, (url, callback) => {
        fetchUrl(url, callback)
      }, (err, result) => {
        console.log('final:')
        console.log(result)
        res.send(result)
      })
  })
})
