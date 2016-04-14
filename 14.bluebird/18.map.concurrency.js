#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')
var nopt = require('nopt')

var common = require('./00.common')

var options = nopt({
  concurrency: Number
}, {
  'co': ['--concurrency'],
  'co1': ['--concurrency', '1'],
  'coi': ['--concurrency', 'Infinity']
}, process.argv, 2)
var concurrency = options.concurrency ?
  parseFloat(options.concurrency) :
  parseFloat('Infinity')

console.time("START")

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
  .filter(function (file) {
    var filePath = path.join(__dirname, file.name)

    var item = fs.statAsync(filePath)
      .then(function (stat) {
        return !stat.isDirectory()
      })

    return item
  })
  .call("sort", function (file1, file2) {
    return file2.name.localeCompare(file1.name)
  })
  .then(function (files) {
    var tasks = []

    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      var filePath = path.join(__dirname, file.name)

      var stat = (function (file, i) {
        return fs.statAsync(filePath)
          .delay((i % 3 + 1) * 2000)
          .then(function (stat) {
            return {
              name: file.name,
              stamp: file.stamp,
              size: stat.size,
              id: i
            }
          })
      })(file, i)

      tasks.push(stat)
    }

    return tasks
  })
  .map(function (task, index) {
    return {
      index: index,
      name: task.name,
      stamp: task.stamp,
      size: task.size,
      id: task.id
    }
  }, {
    concurrency: +concurrency
  })
  .then(function (files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      var log = [file.stamp, '---', file.name, '---', file.size, '---', file.id, '---', file.index].join(' ')
      console.log((log).yellow)
    }
    console.log(concurrency)
    console.timeEnd("START")
  })
