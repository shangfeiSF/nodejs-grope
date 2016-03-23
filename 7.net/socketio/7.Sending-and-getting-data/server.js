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

io.on('connection', function (socket) {
  io.emit('greeting', {
    message: 'Hello everyone'
  })

  socket.emit('greeting', {
    message: 'Hello, how are you?'
  })

  socket.on('answer', function (data) {
    console.log(data.message)
  })

  socket.on('execute', function(data, handle){
    var servertime = new Date().getTime()
    handle(data, servertime)
  })

  socket.on('disconnect', function () {
    console.log('some one disconnect')
  })
})

server.listen(8080, function () {
  console.log('server listen 127.0.0.1:8080')
})