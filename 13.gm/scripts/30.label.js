#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Label(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .label('%m:%f %wx%h')
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Label({
  src: ['original.png'],
  dst: ['30.label.jpg']
})