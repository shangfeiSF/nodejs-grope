var Promise = require("bluebird")

var fs = require('fs')
Promise.promisifyAll(fs)

var util = require('util')
var path = require('path')
var crypto = require('crypto')

var colors = require('colors')

var express = require('express')
var multiparty = require('multiparty')
var bodyParser = require('body-parser')

var gm = require('gm')

function Hash(config) {
  this.algorithms = config.algorithms
  this.encoding = config.encoding
}

Hash.prototype.gen = function (filename) {
  var self = this
  var stamp = parseInt(
    +new Date()
    + Math.floor(Math.random() * 5E10)
  )
  var generator = crypto.createHash(self.algorithms)

  var encrypted = ''
  generator.update(filename + stamp)
  encrypted += generator.digest(self.encoding)

  return encrypted.length ? encrypted : stamp
}

var hash = new Hash({
  algorithms: 'RSA-SHA1-2',
  encoding: 'hex'
})

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

var Forms = {
  count: 0,
  data: []
}

var app = express()

app.use(express.static('asset'))
app.use('/images', express.static('asset/images'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

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

app.post('/users/form', function (req, res) {
  req.body.id = Forms.count++
  Forms.data.push(req.body)

  var result = JSON.stringify({
    count: Forms.count,
    data: Forms.data
  }, null, 2)

  console.log((req.headers['user-agent'] + '-----' + req.url).bold.yellow)
  res.send(result)
})

app.get('/pages/formdata.html', function (req, res) {
  var file = path.join(__dirname, 'pages/formdata.html')

  fs.readFile(file, function (error, data) {
    res.writeHead(200)
    res.end(data)
  })
})

app.post('/users/formdata', function (req, res) {
  var uploadDir = 'asset/images'
  var base = 'http://localhost:8080/images/'
  var form = new multiparty.Form({
    'uploadDir': uploadDir
  })

  form.parse(req, function (err, fields, files) {
    if (err) {
      res.send({
        links: [],
        code: '404'
      })
    }

    Promise.reduce(files.files, function (links, file) {
        var prefix = hash.gen(file.originalFilename)
        var full = [prefix, file.originalFilename].join('_')
        var convert = [prefix, file.originalFilename.replace(/\.png$/, '.jpg')].join('_')

        links.push({
          url: base + convert,
          original: file.originalFilename,
          path: file.path,
          rename: null,
          convert: null
        })

        var oldPath = path.join(__dirname, file.path)
        var newPath = path.join(__dirname, uploadDir, full)
        var convertPath = path.join(__dirname, uploadDir, convert)

        return fs.renameAsync(oldPath, newPath)
          .then(function () {
            console.log('[Uploaded] --- '.green + full + ' has been uploaded'.green)
            links[links.length - 1].rename = full

            return new Promise(function (resolve) {
              gm(newPath).write(convertPath, resolve)
            })
          })
          .then(function () {
            links[links.length - 1].convert = convert
            console.log('[Converted] --- '.white + convert + ' has been converted'.white)

            return links
          })
      }, [])
      .then(function (links) {
        console.log(
          util.inspect(links, {
            showHidden: false,
            depth: null
          })
        )
        res.send({
          links: links
        })
      })
  })
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