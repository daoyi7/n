const http = require('http')

http.createServer((request, response) => {
  response.writeHead(
    200,
    {
      'Content-Type': 'text/plain'
    }
  )

  response.end('Hello World\n')
}).listen(2017)

console.log('Server running at http://172.0.0.1:2017')
