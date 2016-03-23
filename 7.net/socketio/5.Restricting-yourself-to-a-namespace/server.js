var http = require('http')
var path = require('path')
var express = require('express')
var socketio = require('socket.io')

var app = express()
var server = http.Server(app)

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '/index.html'))
})
app.get('/client.js', function (request, response) {
  response.sendFile(path.join(__dirname, '/client.js'))
})

var io = socketio(server)

var chat = io.of('/chat')
  .on('connection', function (socket) {
    socket.emit('greeting', {
      'message': 'Hello'
    })

    chat.emit('login', {
      'message': 'some one login'
    })

    socket.on('connected', function(data){
      console.log(data.message)
    })
  })

var news = io.of('/news')
  .on('connection', function (socket) {
    socket.emit('news', {
      news: 'some news'
    })

    socket.on('recevied', function(data){
      console.log(data.message)
    })
  })

server.listen(8080, function () {
  console.log('server listen 127.0.0.1:8080')
})