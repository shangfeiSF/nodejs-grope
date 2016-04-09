#!/usr/bin/env node
var gm = require('gm')
var common = require('./00.common')

function Colors(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .colors(4)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Colors({
  src: ['original.png'],
  dst: ['09.colors.jpg']
})