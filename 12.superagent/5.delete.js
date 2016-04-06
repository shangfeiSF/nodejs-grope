#!/usr/bin/env node
var colors = require('colors')
var superagent = require('superagent')

var url = 'http://localhost:8080/users/remove/'

superagent.delete(url + 0)
  .end(function (err, res) {
    console.log('[DELETE #1] -- ' + res.text.red)
  })

superagent.del(url + 1)
  .end(function (err, res) {
    console.log('[DELETE #2] -- ' + res.text.red)
  })

superagent('DELETE', url + 2)
  .end(function (err, res) {
    console.log('[DELETE #2] -- ' + res.text.red)
  })