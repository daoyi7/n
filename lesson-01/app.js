const express = require('express')

const app = express()

app.get('/', (req,res) => {
  res.send('Hello World')
})

app.listen(7777, () => {
  console.log('app is listening at port 7777')
})
