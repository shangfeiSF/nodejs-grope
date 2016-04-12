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
  .then(function (files) {
    return Promise.each(files, function (file, index) {
      var filePath = path.join(__dirname, file.name)

      var info = new Promise(function (resolve) {
        resolve({
          name: file.name,
          stamp: file.stamp,
          index: index
        })
      })
        .then(function (info) {
          return info
        })

      var stat = fs.statAsync(filePath)

      var contents = fs.readFileAsync(filePath)

      var result = Promise.join(info, stat, contents, function (info, stat, contents) {
        console.dir(info)
        console.log(contents.length)
        console.log(stat.size)
      })

      return result
    })
  })
  .then(function (files) {
    console.log('-----------------------------------')
    console.log(files)
    console.log('-----------------------------------')
  })
