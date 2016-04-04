var colors = require('colors')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

var users = [{
  name: 'shangfei',
  authority: 'admin'
}, {
  name: 'emmammon',
  authority: 'guest'
}, {
  name: 'xixi',
  authority: 'developer'
}]

app.get('/users', function (req, res) {
  res.send(JSON.stringify(users, null, 2))
})

app.post('/create', function (req, res) {
  function test() {
    var items = [1, 2, 3]
    items.forEach(function (item) {
      item = item++
    })
    console.log(items.join('#'))
  }

  console.log('begin')
  test()
  if (req.body) {
    users.push(req.body)
    res.send(JSON.stringify(users, null, 2))
  }

  console.log('456')
})

app.delete('/user/:id', function (req, res) {
  console.log(req)
})

var server = app.listen(8080, function () {
  console.log('[Server] -- listening localhost:8080....'.green)
})