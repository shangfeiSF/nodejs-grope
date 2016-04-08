#!/usr/bin/env node
var common = require('./00.common')
var imageMagick = require('gm').subClass({
  imageMagick: true
})

function Colorize(images) {
  var images = common.prepare(images)

  imageMagick(images.src[0])
    .colorize(80, 0, 30)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Colorize({
  src: ['original.png'],
  dst: ['08.colorize.jpg']
})
