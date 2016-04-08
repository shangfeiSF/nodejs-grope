#!/usr/bin/env node
var common = require('./00.common')
var imageMagick = require('gm').subClass({
  imageMagick: true
})

function ChangeFormat(images) {
  var images = common.prepare(images)

  imageMagick(images.src[0])
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new ChangeFormat({
  src: ['original.png'],
  dst: ['05.changeFormat.jpg']
})