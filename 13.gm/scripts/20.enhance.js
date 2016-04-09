#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Enhance(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .enhance()
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Enhance({
  src: ['original.png'],
  dst: ['20.enhance.jpg']
})