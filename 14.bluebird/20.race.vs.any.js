#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')

var colors = require('colors')

var pormise = [
  Promise.resolve({
    text: 'OK',
    code: 200
  }),
  Promise.resolve({
    text: 'Accepted',
    code: 202
  }),
  Promise.reject({
    text: 'Not Found',
    code: 404
  }),
  Promise.reject({
    text: 'Bad Gateway',
    code: 502
  })
]

var success = function (response) {
  var log = ['race', '---', response.code, '---', response.text].join(' ')
  console.log((log).green)
}

var error = function (error) {
  var log = ['race', '---', error.code, '---', error.text].join(' ')
  console.log((log).red)

}

var list = [2, 1, 2, 3]

var Iteration = (function (list) {
  return list.map(function (index) {
    return pormise[index]
  })
})(list)

Promise.race(Iteration)
  .then(success)
  .catch(error)

Promise.any(Iteration)
  .then(success)
  .catch(error)
