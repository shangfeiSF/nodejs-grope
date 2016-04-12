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
      console.log(('[#' + index + '] --- ' + names[index]).green)
      files.push({
        name: names[index],
        stamp: common.stamp()
      })
    }

    return files
  })
  .filter(function (file) {
    var files = fs.statAsync(file.name)
      .then(function (stat) {
        return !stat.isDirectory()
      })

    return files
  })
  .map(function (file) {
    var filePath = path.join(__dirname, file.name)

    var stat = fs.statAsync(filePath)

    var contents = fs.readFileAsync(filePath)

    var files = Promise.join(stat, contents, function (stat, contents) {
      return {
        name: file.name,
        stamp: file.stamp,
        stat: stat,
        contents: contents
      }
    })

    return files
  })
  .then(function (files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      console.log((file.stamp + ' --- ' + file.name).yellow)
      console.log(('[Stat.size] --- ' + file.stat.size).cyan)
      console.log(('[Contents.length] --- ' + file.contents.length).cyan)
    }
  })
