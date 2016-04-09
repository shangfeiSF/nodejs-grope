#!/usr/bin/env node
var gm = require('gm')
var common = require('./00.common')

function Background(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .crop(100, 100, 20, 40)
    .extent(200, 200, '-100-100')
    .background('#36AEC0')
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Background({
  src: ['original.jpg'],
  dst: ['02.background.png']
})