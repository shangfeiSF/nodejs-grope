#!/usr/bin/env node
var colors = require('colors')
var superagent = require('superagent')

var url = 'http://localhost:8080/users/form'

superagent
  .post(url)
  .set('Content-Type', 'application/json')
  .send({
    name: 'form--1'
  })
  .send({
    authority: 'admin'
  })
  .end(function (err, res) {
    console.log('[FORM #1] -- ' + res.text.yellow)
  })

superagent
  .post(url)
  .send({
    name: 'form--2'
  })
  .send({
    authority: 'developer'
  })
  .end(function (err, res) {
    console.log('[FORM #2] -- ' + res.text.yellow)
  })

superagent
  .post(url)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .send({
    name: 'form--3'
  })
  .send({
    authority: 'guest'
  })
  .end(function (err, res) {
    console.log('[FORM #3] -- ' + res.text.yellow)
  })

superagent
  .post(url)
  .type('form')
  .send({
    name: 'form--4'
  })
  .send({
    authority: 'guest'
  })
  .end(function (err, res) {
    console.log('[FORM #4] -- ' + res.text.yellow)
  })