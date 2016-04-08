#!/usr/bin/env node
var common = require('./00.common')
var imageMagick = require('gm').subClass({
  imageMagick: true
})

function Chop(images) {
  var images = common.prepare(images)

  imageMagick(images.src[0])
    .chop(54, 100, 307, 100)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Chop({
  src: ['original.png'],
  dst: ['07.chop.jpg']
})