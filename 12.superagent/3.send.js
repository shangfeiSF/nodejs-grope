#!/usr/bin/env node
var colors = require('colors')
var superagent = require('superagent')

var url = 'http://localhost:8080/users/sample/add'

superagent
  .post(url)
  .send({
    name: 'send--1',
    authority: 'admin'
  })
  .end(function (err, res) {
    console.log('[SEND #1] -- ' + res.text.yellow)
  })

superagent
  .post(url)
  .set('Content-Type', 'application/json')
  .send('{"name":"send--2","authority":"developer"}')
  .end(function (err, res) {
    console.log('[SEND #2] -- ' + res.text.yellow)
  })

superagent
  .post(url)
  .send({ name: 'send--3' })
  .send({ authority: 'guest' })
  .end(function (err, res) {
    console.log('[SEND #3] -- ' + res.text.yellow)
  })