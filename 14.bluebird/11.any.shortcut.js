#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

fs.readdirAsync(process.cwd())
  .then(function (names) {
    var tasks = []

    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      var filePath = path.join(__dirname, name)

      var info = new Promise(function (resolve) {
        resolve({
          name: name,
          stamp: common.stamp()
        })
      })
        .then(function (info) {
          return info
        })

      var stat = fs.statAsync(filePath)

      var contents = fs.readFileAsync(filePath)

      tasks.push(
        Promise.join(info, stat, contents, function (info, stat, contents) {
          return {
            name: info.name,
            stamp: info.stamp,
            size: stat.size,
            length: contents.length
          }
        })
      )
    }

    return tasks
  })
  .any()
  .then(function (file) {
    console.log('isObject?', file instanceof Object)
    console.log(file)
  })
