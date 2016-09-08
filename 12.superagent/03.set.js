#!/usr/bin/env node
var colors = require('colors')
var superagent = require('superagent')

var url = 'http://localhost:8080/users/advanced/add'

superagent
  .post(url)
  .set('Content-Type', 'application/json')
  .set('Time-Stamp', new Date().toUTCString())
  .send({
    name: 'set--1',
    authority: 'admin'
  })
  .end(function (err, res) {
    console.log('[SET #1] -- ' + res.text.magenta)
  })

superagent
  .post(url)
  .set('TIME-STAMP', new Date().toUTCString())
  .send({
    name: 'set--2',
    authority: 'developer'
  })
  .end(function (err, res) {
    console.log('[SET #2] -- ' + res.text.magenta)
  })

superagent('POST', url)
  .send({
    name: 'set--3',
    authority: 'guest'
  })
  .end(function (err, res) {
    console.log('[SET #3] -- ' + res.text.magenta)
  })