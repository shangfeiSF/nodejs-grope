var colors = require('colors')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

var current = 3

var users = [{
  id: 0,
  name: 'shangfei',
  authority: 'admin'
}, {
  id: 1,
  name: 'emmammon',
  authority: 'guest'
}, {
  id: 2,
  name: 'xixi',
  authority: 'developer'
}]

app.get('/users', function (req, res) {
  res.send(JSON.stringify(users, null, 2))
})

app.post('/create', function (req, res) {
  if (req.body) {
    req.id = current++
    users.push(req.body)
    res.send(JSON.stringify(users, null, 2))
  }
})

app.delete('/user/:id', function (req, res) {
  users = users.filter(function (user) {
    return user.id !== req.params.id
  })
  res.send(JSON.stringify(users, null, 2))
})

app.listen(8080, function () {
  console.log('[Server] -- listening localhost:8080....'.green)
})