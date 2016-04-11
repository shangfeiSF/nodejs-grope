#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Equalize(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .equalize()
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Equalize({
  src: ['original.png'],
  dst: ['21.equalize.jpg']
})