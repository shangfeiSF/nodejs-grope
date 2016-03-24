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

var connected = 0

io.on('connection', function (socket) {
  // TODO: io.emit 是向所有的client发送
  // TODO: socket.emit 是向建立此socket的client发送
  // TODO: socket.broadcast 是向建立此socket之外的所有clien发送
  socket.broadcast.emit('greeting', {
    message: 'broadcast to every one'
  })
  socket.on('answer', function (data) {
    console.log(data.message)
  })
})

server.listen(8080, function () {
  console.log('server listen 127.0.0.1:8080')
})