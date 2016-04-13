#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

fs.readdirAsync(process.cwd())
  .then(function (names) {
    var files = []

    for (var index = 0; index < names.length; index++) {
      files.push({
        name: names[index],
        stamp: common.stamp()
      })
    }

    return files
  })
  .then(function (files) {
    var tasks = []

    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      var filePath = path.join(__dirname, file.name)

      var info = new Promise(function (resolve) {
        resolve({
          name: file.name,
          stamp: file.stamp
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

    return Promise.some(tasks, 3)
  })
  .then(function (files) {
    console.log('isArray?', files instanceof Array)
    console.log(files)
  })
