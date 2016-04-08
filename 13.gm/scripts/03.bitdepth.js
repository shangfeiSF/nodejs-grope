#!/usr/bin/env node
var common = require('./00.common')
var imageMagick = require('gm').subClass({
  imageMagick: true
})

function Bitdepth(images) {
  var images = common.prepare(images)

  imageMagick(images.src[0])
    .bitdepth(4)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Bitdepth({
  src: ['original.jpg'],
  dst: ['03.bitdepth.jpg']
})