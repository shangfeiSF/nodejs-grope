var colors = require('colors')
var express = require('express')

var app = express()

/*
 * http://localhost:8080/css/css1.css
 * http://localhost:8080/html/index1.html
 * http://localhost:8080/images/1.jpg
 */
app.use(express.static('public'))
/*
 * http://localhost:8080/log.js
 */
app.use(express.static('scripts'))
/*
 * http://localhost:8080/pages/index1.html
 * http://localhost:8080/pages/index2.html
 */
app.use('/pages', express.static('public/html'))

app.use(express.static('options', {
  'dotfiles': 'allow',
  'etag': true,
  'extensions': ['html', 'htm'],
  'index': false,
  'lastModified': true,
  'maxAge': '1m',
  'redirect': false,
  'setHeaders': function (req, res, stat) {
    console.log(arguments[0])
  }
}))

var server = app.listen(8080, function () {
  console.log('[Server] -- listening localhost:8080....'.green)
})