var colors = require('colors')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

var Users = {
  count: 3,
  list: [{
    id: 0,
    name: 'original--1',
    authority: 'admin'
  }, {
    id: 1,
    name: 'original--2',
    authority: 'developer'
  }, {
    id: 2,
    name: 'original--3',
    authority: 'guest'
  }]
}

app.get('/users/list', function (req, res) {
  var result = JSON.stringify({
    count: Users.count,
    users: Users.list
  }, null, 2)

  console.log((req.headers['user-agent'] + '-----' + req.url).green)
  res.send(result)
})

app.post('/users/sample/add', function (req, res) {
  if (req.body) {
    req.body.id = Users.count++
    Users.list.push(req.body)

    var result = JSON.stringify({
      count: Users.count,
      users: Users.list
    }, null, 2)

    console.log((req.headers['user-agent'] + '-----' + req.url).yellow)
    res.send(result)
  }
})

app.post('/users/advanced/add', function (req, res) {
  var timestamp = req.headers['time-stamp'] || new Date().toDateString()

  if (req.body) {
    req.body.id = Users.count++
    Users.list.push(req.body)

    var result = JSON.stringify({
      count: Users.count,
      users: Users.list,
      timestamp: timestamp
    }, null, 2)

    console.log((req.headers['user-agent'] + '-----' + req.url).bold.yellow)
    res.send(result)
  }
})

app.get('/users/search', function (req, res) {
  var querys = req.query

  var range = querys.range ? querys.range.split(',') : [0, Users.list.length]
  var filter = Users.list.filter(function (user) {
    return Number(range[0]) <= user.id && user.id <= Number(range[1])
  })

  var order = querys.order
  if (order === 'desc') filter.reverse()

  var format = querys.format ? querys.format.toLowerCase() === 'true' : false
  var result = format ?
    JSON.stringify({
      count: Users.count,
      users: filter,
      tag: querys.tag || 'none'
    }, null, 2) :
    JSON.stringify({
      count: Users.count,
      users: filter,
      tag: querys.tag || 'none'
    })

  console.log((req.headers['user-agent'] + '-----' + req.url).bold.green)
  res.send(result)
})

app.delete('/users/remove/:id', function (req, res) {
  Users.list = Users.list.filter(function (user) {
    return user.id !== Number(req.params.id)
  })
  Users.count = Users.list.length
  
  var result = JSON.stringify({
    count: Users.count,
    users: Users.list
  }, null, 2)

  console.log((req.headers['user-agent'] + '-----' + req.url).red)
  res.send(result)
})

app.listen(8080, function () {
  console.log('[Server] -- listening localhost:8080....'.cyan)
})