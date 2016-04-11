#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Lower(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .lower(10, 14)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Lower({
  src: ['original.png'],
  dst: ['32.lower.jpg']
})