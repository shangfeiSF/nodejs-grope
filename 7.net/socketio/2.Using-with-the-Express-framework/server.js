var path = require('path')
var express = require('express')
var socketio = require('socket.io')

var server = express.createServer()

server.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '/index.html'))
})
server.get('/client.js', function (request, response) {
  response.sendFile(path.join(__dirname, '/client.js'))
})

var io = socketio(server)

io.on('connection', function (socket) {
  socket.emit('greeting', {
    message: 'Hello, how are you?'
  })

  socket.on('answer', function (data) {
    console.log(data.message)
  })
})

server.listen(8080, function () {
  console.log('server listen 127.0.0.1:8080')
})