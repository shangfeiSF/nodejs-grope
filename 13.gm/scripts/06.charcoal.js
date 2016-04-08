#!/usr/bin/env node
var common = require('./00.common')
var imageMagick = require('gm').subClass({
  imageMagick: true
})

function Charcoal(images) {
  var images = common.prepare(images)

  imageMagick(images.src[0])
    .charcoal(4)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Charcoal({
  src: ['original.png'],
  dst: ['06.charcoal.jpg']
})