#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Gamma(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .gamma(1.7, 2.3, 1.3)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Gamma({
  src: ['original.png'],
  dst: ['26.gamma.png']
})