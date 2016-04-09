#!/usr/bin/env node
var gm = require('gm')
var common = require('./00.common')

function Charcoal(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .charcoal(4)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Charcoal({
  src: ['original.png'],
  dst: ['06.charcoal.jpg']
})