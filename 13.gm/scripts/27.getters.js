#!/usr/bin/env node
var fs = require('fs')
var util = require('util')

var Promise = require("bluebird")
Promise.promisifyAll(fs)

var gm = require('gm')
var colors = require('colors')
var common = require('./00.common')

var getters = ["size", "identify", "format", "depth", "color", "res", "filesize"]

function Getters(images) {
  var images = common.prepare(images)

  Promise.reduce(images.src, function (cencus, image) {
      cencus.push({
        image: image,
        info: null
      })

      return Promise.reduce(getters, function (info, getter) {
          var async = Promise.promisify(gm(image)[getter], {
            context: gm(image)
          })

          return async().then(function (result) {
            info[getter] = result
            return info
          })
        }, {})
        .then(function (info) {
          cencus[cencus.length - 1].info = info
          return cencus
        })

    }, [])
    .then(function (census) {
      var data = {
        getters: getters,
        census: census
      }
      fs.writeFileAsync('./log/27.getters.json', JSON.stringify(data, null, 2), 'utf-8')
        .then(function () {
          console.log(util.inspect(census, {
            showHidden: false,
            depth: null
          }))
        })
    })
}

new Getters({
  src: ['original.png', 'original.jpg'],
  dst: ['']
})