#!/usr/bin/env node
var gm = require('gm')
var common = require('./00.common')

function Bitdepth(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .bitdepth(2)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Bitdepth({
  src: ['original.jpg'],
  dst: ['03.bitdepth.jpg']
})