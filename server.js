const PORT = 2017
const http = require('http')
const fs = require('fs')

const dev = 'D:/Project/iframe/n'

http.createServer((request, response) => {

  let file = dev + '/src/index.html';

  fs.readFile(file, (err, data) => {
    if(err) {
      response.writeHeader(
        404,
        {
          // 'Content-Type': 'text/html:charset = "UTF-8"'
          'Content-Type' : 'text/html;charset="UTF-8"'
        }
      )

      response.write('<h1>404</h1><p>你要找的页面不存在</p>')
      response.end()
    }else {
      response.writeHeader(
        200,
        {
          // 'Content-Type': 'text/html:charset = "UTF-8"'
          'Content-Type' : 'text/html;charset="UTF-8"'
        }
      )

      response.write(data)
      response.end()
    }
  })
}).listen(PORT)

console.log('Server running at http://172.0.0.1:2017')
