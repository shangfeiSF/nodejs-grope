#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Emboss(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .emboss(2)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Emboss({
  src: ['original.png'],
  dst: ['19.emboss.jpg']
})