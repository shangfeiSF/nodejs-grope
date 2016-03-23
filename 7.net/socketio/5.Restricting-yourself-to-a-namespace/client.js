var chat = io.connect('http://localhost:8080/chat')
var news = io.connect('http://localhost:8080/news')

chat.on('connect', function () {
  chat.emit('connected', {
    message: +new Date()
  })
})

chat.on('greeting', function(data){
  console.log(data.message)
})

chat.on('login', function(data){
  console.log(data.message)
})

news.on('news', function (data) {
  console.log(data.news)
  news.emit('recevied', {
    message: 'Thank you for sending ' + data.news
  })
})