var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')

var common = require('./00.common')

fs.readdirAsync(".")
  .then(function (files) {
    var result = []

    for (var index = 0; index < files.length; index++) {
      console.log(('[File #' + index + '] --- ' + files[index]).green)
      result.push({
        name: files[index],
        stamp: common.stamp()
      })
    }

    return result
  })
  .map(function (file) {
    debugger
    var filePath = path.join(__dirname, file.name)

    var stat = fs.statAsync(filePath)

    var contents = fs.readFileAsync(filePath)

    return Promise.join(stat, contents, function (stat, contents) {
      return {
        name: file.name,
        stamp: file.stamp,
        stat: stat,
        contents: contents
      }
    })
  })
  .then(function (data) {
    debugger
    return data
  })
  .call("sort", function (file1, file2) {
    return file1.fileName.localeCompare(file2.fileName)
  })
  .then(function (data) {
    for (var i = 0; i < data.length; i++) {
      var size = data[i].stat.isDirectory() ? 'Directory' : data[i].contents.length
      console.log(data[i].name + ' --- ' + size)
    }
  })
