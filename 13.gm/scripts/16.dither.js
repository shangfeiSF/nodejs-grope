#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Dither(images) {
  var images = common.prepare(images)
3
  gm(images.src[0])
    .monochrome()
    .dither()
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Dither({
  src: ['original.png'],
  dst: ['16.dither.jpg']
})