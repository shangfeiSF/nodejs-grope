#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Morph(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .morph(images.src[1], images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Morph({
  src: ['original.png', 'morpher.jpg'],
  dst: ['38.morph.jpg']
})