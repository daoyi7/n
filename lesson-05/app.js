const async = require('async')

let concurrencyCount = 0

const fetchUrl = (url, callback) => {
  let delay = parseInt((Math.random() * 10000000) % 2000, 10)

  concurrencyCount++
  console.log('现在的并发数是', concurrencyCount, '，正在抓去的是', url, '，耗时' + delay + '毫秒')

  setTimeout(() => {
    concurrencyCount--
    callback(null, url + 'html content')
  }, delay)
}

let urls = []
for (let i = 0; i < 30; i++) {
  urls.push('http://datasource_' + i)
}

async.mapLimit(urls, 5, (url, callback) => {
  fetchUrl(url, callback)
}, (err, result) => {
  console.log('final:' + result)
})
