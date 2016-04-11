#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Gravity(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .resize(100, 50)
    .gravity('SouthEast')
    .extent(400, 400)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Gravity({
  src: ['original.png'],
  dst: ['28.gravity.jpg']
})
