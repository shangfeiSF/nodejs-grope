#!/usr/bin/env node
var gm = require('gm')
var common = require('./00.common')

function ChangeFormat(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new ChangeFormat({
  src: ['original.png'],
  dst: ['05.changeFormat.jpg']
})