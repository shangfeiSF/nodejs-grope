var socket = io('http://localhost:8080')
var greetings = document.getElementById('greetings')

var timeout = null

socket.on('connect', function () {
  socket.send('connected')
  socket.on('message', function (message) {
    var dom = document.createElement('div')
    dom.innerHTML = message
    greetings.appendChild(dom)
    socket.send('recevied ' + new Date().getTime())
  })
})