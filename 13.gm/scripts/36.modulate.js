#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Modulate(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .modulate(120, 100, 80)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Modulate({
  src: ['original.png'],
  dst: ['36.modulate.jpg']
})