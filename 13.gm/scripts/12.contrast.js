#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Contrast(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .contrast(10)
    .contrast(-5)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Contrast({
  src: ['original.png'],
  dst: ['12.contrast.jpg']
})
