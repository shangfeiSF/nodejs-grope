#!/usr/bin/env node
var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require("fs"))

var nopt = require('nopt')
var colors = require('colors')

var common = require('./00.common')

function Search() {
  this.version = function () {
    return '0.1.0'
  }
  this.author = 'yuncong'

  this.options = nopt({
    basename: Boolean,
    extname: Boolean,
    dirname: Boolean,
    logger: Boolean,
    multiArgs: Boolean,
  }, {
    'b': ['--basename'],
    'b1': ['--basename', 'true'],
    'b0': ['--basename', 'false'],
    'e': ['--extname'],
    'e1': ['--extname', 'true'],
    'e0': ['--extname', 'false'],
    'd': ['--dirname'],
    'd1': ['--dirname', 'true'],
    'd0': ['--dirname', 'false'],
    'l': ['--logger'],
    'l1': ['--logger', 'true'],
    'l0': ['--logger', 'false'],
    'm': ['--multiArgs'],
    'm1': ['--multiArgs', 'true'],
    'm0': ['--multiArgs', 'false']
  }, process.argv, 2)
}

Search.prototype.getBasename = function (filename, callback) {
  var self = this
  var basename = path.basename(filename)
  var option = self.options.hasOwnProperty('basename') ? self.options.basename : true

  setTimeout(function () {
    if (option) {
      callback(null, basename, self.version(), self.author)
    } else {
      callback(new Error('getBasename is failed'))
    }
  }, 2000)
}

Search.prototype.getExtname = function (filename, callback) {
  var self = this
  var extname = path.extname(filename)
  var option = self.options.hasOwnProperty('extname') ? self.options.extname : true

  setTimeout(function () {
    if (option) {
      callback(null, extname, self.version(), self.author)
    } else {
      callback(new Error('getExtname is failed'))
    }
  }, 2000)
}

Search.prototype.getDirname = function (filename, callback) {
  var self = this
  var dirname = path.dirname(filename)
  var option = self.options.hasOwnProperty('dirname') ? self.options.dirname : true

  setTimeout(function () {
    if (option) {
      callback(null, dirname, self.version(), self.author)
    } else {
      callback(new Error('getDirname is failed'))
    }
  }, 2000)
}

Search.prototype.logger = function (data, callback) {
  var self = this

  var convert = {}
  if (data instanceof Array) {
    data.forEach(function (item, index) {
      convert[index] = item
    })
  } else {
    convert = data
  }
  var option = self.options.hasOwnProperty('logger') ? self.options.logger : true

  setTimeout(function () {
    if (option) {
      // a node style callback function.
      callback(null, convert, self.version(), self.author, common.stamp())
    } else {
      callback(new Error('logger is failed'))
    }
  }, 2000)
}

var search = new Search()

var getBasenameAsync = Promise.promisify(search.getBasename, {
  context: search,
  multiArgs: true
})

var getExtnameAsync = Promise.promisify(search.getExtname, {
  context: search
})

var getDirnameAsync = Promise.promisify(search.getDirname, {
  context: search,
  multiArgs: true
})

getBasenameAsync(__filename)
  .then(function (result) {
    console.log('--------------getBasenameAsync--------------'.green)
    console.log(result)
    console.log('--------------------------------------------\n'.green)

    // Returns a promise that is resolved by a node style callback function.
    return Promise.fromCallback(function (callback) {
        return search.logger(result, callback)
      }, {multiArgs: true})
      .then(function (info) {
        console.log('--------------getBasenameAsync--------------'.green)
        console.log(info)
        console.log('--------------------------------------------\n'.green)
      })
  }, function (error) {
    console.log('----------------------------'.red)
    console.log(error)
    console.log('----------------------------\n'.red)
  })

getExtnameAsync(__filename)
  .then(function (result) {
    console.log('--------------getExtnameAsync--------------'.yellow)
    console.log(result)
    console.log('-------------------------------------------\n'.yellow)

    return Promise.fromCallback(function (callback) {
        return search.logger(result, callback)
      }, {multiArgs: true})
      .then(function (info) {
        console.log('--------------getExtnameAsync--------------'.yellow)
        console.log(info)
        console.log('-------------------------------------------\n'.yellow)
      })
  }, function (error) {
    console.log('----------------------------'.red)
    console.log(error)
    console.log('----------------------------\n'.red)
  })

getDirnameAsync(__filename)
  .then(function (result) {
    console.log('--------------getDirnameAsync--------------'.white)
    console.log(result)
    console.log('-------------------------------------------\n'.white)
    
    // written more concisely with Function.prototype.bind
    return Promise.fromCallback(search.logger.bind(search, result), {multiArgs: true})
      .then(function (info) {
        console.log('--------------getDirnameAsync--------------'.white)
        console.log(info)
        console.log('-------------------------------------------\n'.white)
      })
  }, function (error) {
    console.log('----------------------------'.red)
    console.log(error)
    console.log('----------------------------\n'.red)
  })