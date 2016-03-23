var socket = io('http://localhost:8080')
var greetings = document.getElementById('greetings')

socket.on('greeting', function (data) {
  var message = document.createElement('div')
  message.innerHTML = data.message
  greetings.appendChild(message)

  socket.emit('answer', {
    message: 'I am fine. Thank you'
  })

  socket.emit('execute', {
    message: 'I am fine. Thank you'
  }, function(data, servertime){
    console.info(servertime)
    console.warn(data)
  })
})

setTimeout(function () {
  socket.disconnect()
}, 4000)
