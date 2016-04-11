#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Median(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .median(4)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Median({
  src: ['original.png'],
  dst: ['34.median.jpg']
})