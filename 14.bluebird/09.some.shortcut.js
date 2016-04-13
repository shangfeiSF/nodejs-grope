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

      // info 这个promise是必须的, 否则name只会取到最后一个
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
  .some(3)
  .then(function (files) {
    console.log('isArray?', files instanceof Array)
    console.log(files)
  })
