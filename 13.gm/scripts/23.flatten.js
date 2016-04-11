#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Flatten(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .flatten()
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Flatten({
  src: ['layers.psd'],
  dst: ['23.flatten.jpg']
})