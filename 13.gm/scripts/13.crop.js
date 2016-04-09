#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Crop(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .crop(200, 155, 300, 0)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Crop({
  src: ['original.png'],
  dst: ['13.crop.jpg']
})