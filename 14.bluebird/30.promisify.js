#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var colors = require('colors')
var gm = require('gm')

var common = require('./00.common')

var getters = ["size", "identify", "format", "depth", "color", "res", "filesize"]

function Getters(name) {
  var imagePath = path.join(__dirname, 'asset', name)
  var context = gm(imagePath)

  Promise.reduce(getters, function (census, getter) {
      // Promise.promisify的context配置，需要根据promisify的方法来决定是否配置
      var async = Promise.promisify(context[getter], {
        context: context
      })

      return async()
        .then(function (result) {
          census[getter] = result
          return census
        })
    }, {})
    .then(function (census) {
      var data = {
        getters: getters,
        census: census
      }
      fs.writeFileAsync('./asset/28.promisify.json', JSON.stringify(data, null, 2), {
        encoding: 'utf-8',
        flag: 'w+'
      })
    })
}

new Getters('30.promisify.jpg')

// Promise.promisify 支持转换的方法需要满足以下：
// （1）The  function should conform to node.js convention of accepting a callback as last argument
// （2）and calling that callback with error as the first argument
// （3）and success value on the second argument.
function GetPath(name, callback) {
  var imagePath = path.join(__dirname, 'asset', name)

  setTimeout(function () {
    callback(null, imagePath)
  }, 2000)
}

// Setting multiArgs to true means the resulting promise will always fulfill with an array of the callback's success value(s).
function GetPathAndDir(name, callback) {
  var imagePath = path.join(__dirname, 'asset', name)

  setTimeout(function () {
    callback(null, imagePath, __dirname)
  }, 2000)
}

function Utils() {
  this.private = function () {
    return 200
  }
}
Utils.prototype.getPathAndDir = function (name, callback) {
  var self = this
  var imagePath = path.join(__dirname, 'asset', name)

  setTimeout(function () {
    callback(null, imagePath, __dirname, self.private())
  }, 2000)

}

var utils = new Utils()

var GetPathAsync = Promise.promisify(GetPath)

var GetPathAndDirAsync_success = Promise.promisify(GetPathAndDir, {
  multiArgs: true
})
var GetPathAndDirAsync_failed = Promise.promisify(GetPathAndDir)

var UtilsGetPathAndDir_success = Promise.promisify(utils.getPathAndDir, {
  context: utils,
  multiArgs: true
})
var UtilsGetPathAndDir_failed = Promise.promisify(utils.getPathAndDir, {
  // context: utils,
  multiArgs: true
})


GetPathAsync('30.promisify.jpg')
  .then(function (result) {
    console.log(result)
  })

GetPathAndDirAsync_success('30.promisify.jpg')
  .then(function (result) {
    console.log(result)
  })

GetPathAndDirAsync_failed('30.promisify.jpg')
  .then(function (result) {
    console.log(result)
  })

UtilsGetPathAndDir_success('30.promisify.jpg')
  .then(function (result) {
    console.log(result)
  })

UtilsGetPathAndDir_failed('30.promisify.jpg')
  .then(function (result) {
    console.log(result)
  })