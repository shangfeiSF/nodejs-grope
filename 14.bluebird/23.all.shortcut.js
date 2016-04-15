#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

fs.readdirAsync(process.cwd())
  .filter(function (name) {
    var filePath = path.join(__dirname, name)

    var item = fs.statAsync(filePath)
      .then(function (stat) {
        return !stat.isDirectory()
      })

    return item
  })
  .then(function (names) {
    var tasks = []

    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      var filePath = path.join(__dirname, name)

      var info = Promise.resolve({
        name: name,
        stamp: common.stamp()
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
  .all()
  .then(function (files) {
    console.log('---------------------------------------'.white)
    for (var index = 0; index < files.length; index++) {
      var file = files[index]

      var log = [[index].join('---'), [file.name, file.stamp, file.size, file.length].join('---')].join(' ==> ')
      console.log(log)
    }
  })
