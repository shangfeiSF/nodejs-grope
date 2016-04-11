#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Flop(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .flop()
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Flop({
  src: ['original.png'],
  dst: ['25.flop.jpg']
})