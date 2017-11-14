const PORT = 2017
const http = require('http')
const fs = require('fs')

const dev = 'D:/Project/iframe/n'

http.createServer((req, res) => {

  let file = dev + '/src/index.html';

  fs.readFile(file, (err, data) => {
    if(err) {
      res.writeHeader(
        404,
        {
          'Content-Type' : 'text/html;charset="UTF-8"'
        }
      )

      res.write('<h1>404</h1><p>你要找的页面不存在</p>')
      res.end()
    }else {
      res.writeHeader(
        200,
        {
          'Content-Type' : 'text/html;charset="UTF-8"'
        }
      )

      res.write(data)
      res.end()
    }
  })
}).listen(PORT)

console.log('Server running at http://172.0.0.1:2017')
