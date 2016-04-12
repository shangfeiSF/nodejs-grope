#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Monochrome(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .monochrome()
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Monochrome({
  src: ['original.png'],
  dst: ['37.monochrome.jpg']
})