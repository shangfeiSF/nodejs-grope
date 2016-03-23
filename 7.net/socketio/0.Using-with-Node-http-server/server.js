var fs = require('fs')
var http = require('http')
var socketio = require('socket.io')

var server = http.createServer(function (request, response) {
  fs.readFile(__dirname + '/index.html',
    function (error, data) {
      if (error) {
        response.writeHead(500)
        return response.end('Error loading index.html')
      }

      response.writeHead(200)
      response.end(data)
    })
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