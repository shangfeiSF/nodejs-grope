var colors = require('colors')
var express = require('express')

var app = express()

app.use(express.static('public'))
app.use(express.static('files'))
app.use('/static', express.static('public/css'))

var server = app.listen(8080, function(){
  console.log('[Server] -- listening localhostL8080....'.green)
})