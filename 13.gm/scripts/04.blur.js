#!/usr/bin/env node
var gm = require('gm')
var common = require('./00.common')

function Blur(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .blur(19, 10)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Blur({
  src: ['original.png'],
  dst: ['04.blur.jpg']
})