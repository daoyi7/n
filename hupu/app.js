const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')
const eventproxy = require('eventproxy');
const url = require('url')

const app = express()

app.listen(7777, () => {
  console.log('hupu API is running at port 7777')
})

const hc = 'https://bbs.hupu.com/bxj'

app.get('/', (req, res, next) => {
  superagent.get(hc)
    .end((err, sres) => {
      if(err) {
        res.send(err)
      }

      const $ = cheerio.load(sres.text)
      let bxj_api = []
      let bxj_topic_urls = []

      $(".bbsHotPit .show-list li").each((idx, ele) => {
        const $t = $(ele).find(".titlelink").find("a").eq(0)
        const $author = $(ele).find(".author").find("a")
        // 把回复和浏览一起转成数组
        const $reply = $(ele).find(".ansour").text().trim().split('')
        // 查找 " / " 符号在数组中的位置
        const $reply_split_index = $reply.indexOf('/')

        let post_id = $t.attr("href").split("").slice(1, 9).join("")
        let post_href = url.resolve(hc, $t.attr("href"))
        let post_title = $t.text()
        let post_author = $author.eq(0).text().trim()
        let post_time = $author.eq(1).text().trim()
        let post_reply = $reply.slice(0, $reply_split_index).join("").trim()
        let post_view = $reply.slice($reply_split_index + 1, $reply.length + 1).join("").trim()
        let latest_reply = $(ele).find(".endreply .endauthor").text().trim()

        bxj_api.push({
          id: post_id,
          href: post_href,
          title: post_title,
          author: post_author,
          create_time: post_time,
          reply: post_reply,
          view: post_view,
          latest_reply: latest_reply,
        })
        bxj_topic_urls.push(post_href)
      })

      res.send(bxj_api)
    })
})
