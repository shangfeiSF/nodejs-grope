#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Limit(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .limit('memory", "32MB')
    .limit('map", "64MB')
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Limit({
  src: ['original.png'],
  dst: ['31.limit.jpg']
})