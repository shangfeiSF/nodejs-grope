#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')
var nopt = require('nopt')

var common = require('./00.common')

function Query() {
  this.limit = 10
  this.cache = {
    "3": "map",
    "4": "any"
  }

  this.options = nopt({
    input: Number
  }, {
    'in': ['--input'],
    'in1': ['--input', '1'],
    'in2': ['--input', '2'],
    'in3': ['--input', '3'],
    'in4': ['--input', '4'],
    'in8': ['--input', '8'],
    'in9': ['--input', '9']
  }, process.argv, 2)

  this.db = path.join(__dirname, 'asset', '28.method.json')
}

Query.prototype.find = function () {
  var self = this
  var input = self.options.input ? self.options.input : null

  if (input === null) {
    return Promise.reject(new Error("need input"))
  }

  if (input > 10) {
    return Promise.reject(new Error("input is beyond " + self.limit))
  }

  if (self.cache.hasOwnProperty(input)) {
    return Promise.resolve({
      message: 'Read in cache',
      name: this.cache[input]
    })
  }

  return fs.readFileAsync(self.db)
    .then(function (data) {
      var data = JSON.parse(data)
      var result = {
        message: 'Read in dataBase',
        name: 'None field named ' + input,
      }

      if (data.hasOwnProperty(input)) {
        result.name = data[input]
      }

      return result
    })
}

Query.prototype.findPromise = Promise.method(function () {
  var self = this
  var input = self.options.input ? self.options.input : null

  if (input === null) {
    return new Error("need input")
  }

  if (input > 10) {
    return new Error("input is beyond " + self.limit)
  }

  if (self.cache.hasOwnProperty(input)) {
    return {
      message: 'Read in cache',
      name: this.cache[input]
    }
  }

  return fs.readFileAsync(self.db)
    .then(function (data) {
      var data = JSON.parse(data)
      var result = {
        message: 'Read in dataBase',
        name: 'None field named ' + input,
      }

      if (data.hasOwnProperty(input)) {
        result.name = data[input]
      }

      return result
    })
})

new Query()
  .find()
  .then(function (result) {
    console.log(result.message.yellow)
    console.log(('Name --- ' + result.name).yellow)
  })
  .catch(function (err) {
    console.log(err)
  })

new Query()
  .findPromise()
  .then(function (result) {
    console.log(result.message.green)
    console.log(('Name --- ' + result.name).green)
  })
  .catch(function (err) {
    console.log(err)
  })