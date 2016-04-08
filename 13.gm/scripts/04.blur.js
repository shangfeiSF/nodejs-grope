#!/usr/bin/env node
var common = require('./00.common')
var imageMagick = require('gm').subClass({
  imageMagick: true
})

function Blur(images) {
  var images = common.prepare(images)

  imageMagick(images.src[0])
    .blur(19, 10)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Blur({
  src: ['original.png'],
  dst: ['04.blur.jpg']
})