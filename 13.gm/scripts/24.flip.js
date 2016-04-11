#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Flip(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .flip()
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Flip({
  src: ['original.png'],
  dst: ['24.flip.jpg']
})