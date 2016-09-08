#!/usr/bin/env node
var colors = require('colors')
var superagent = require('superagent')

var url = 'http://localhost:8080/users/search'

superagent
  .get(url)
  .query({
    order: 'asc',
    range: '0,1',
    tag: 'query#1',
    format: 'true'
  })
  .end(function (err, res) {
    console.log('[QUERY #1] -- ' + res.text.green)
  })

// #编码的问题
var special = encodeURIComponent('#')
superagent
  .get(url)
  .query('order=desc&range=2,3&tag=query' + special + '2&format=true')
  .end(function (err, res) {
    console.log('[QUERY #2] -- ' + res.text.green)
  })

superagent
  .get(url)
  .query({order: 'asc'})
  .query({range: '0,3'})
  .query({tag: 'query#3'})
  .query({format: 'false'})
  .end(function (err, res) {
    console.log('[QUERY #3] -- ' + res.text.green)
  })
