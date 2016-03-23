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

var timeout = null

io.on('connection', function (socket) {
  timeout = setInterval(function () {
    socket.send('Hello ' + new Date().getTime())
  }, 2000)

  socket.on('message', function (message) {
    console.log(message)
  })
  socket.on('disconnect', function () {
    clearInterval(timeout)
    console.log('disconnect')
    console.log('------------------------------')
  })
})

server.listen(8080, function () {
  console.log('server listen 127.0.0.1:8080')
})