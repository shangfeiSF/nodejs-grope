#!/usr/bin/env node
var common = require('./00.common')
var imageMagick = require('gm').subClass({
  imageMagick: true
})

function Background(images) {
  var images = common.prepare(images)

  imageMagick(images.src[0])
    .crop(140, 100)
    .background('#FF0000')
    .extent(240, 200)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Background({
  src: ['original.jpg'],
  dst: ['02.background.png']
})