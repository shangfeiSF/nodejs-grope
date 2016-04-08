#!/usr/bin/env node
var common = require('./00.common')
var imageMagick = require('gm').subClass({
  imageMagick: true
})

function Colors(images) {
  var images = common.prepare(images)

  imageMagick(images.src[0])
    .colors(4)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Colors({
  src: ['original.png'],
  dst: ['09.colors.jpg']
})