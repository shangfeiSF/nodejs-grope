#!/usr/bin/env node
var colors = require('colors')
var superagent = require('superagent')

var url = 'http://localhost:8080/users/sample/add'

superagent
  .post(url)
  .send({
    name: 'post--1',
    authority: 'admin'
  })
  .end(function (err, res) {
    console.log('[POST #1] -- ' + res.text.yellow)
  })

superagent('POST', url)
  .send({
    name: 'post--2',
    authority: 'developer'
  })
  .end(function (err, res) {
    console.log('[POST #2] -- ' + res.text.yellow)
  })