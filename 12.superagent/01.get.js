#!/usr/bin/env node
var colors = require('colors')
var superagent = require('superagent')

var url = 'http://localhost:8080/users/list'

superagent
  .get(url)
  .end(function (err, res) {
    console.log('[GET #1] -- ' + res.text.green)
  })

superagent('GET', url)
  .end(function (err, res) {
    console.log('[GET #2] -- ' + res.text.green)
  })

superagent(url, function (err, res) {
  console.log('[GET #3] -- ' + res.text.green)
})