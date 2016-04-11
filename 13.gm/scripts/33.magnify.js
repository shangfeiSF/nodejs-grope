#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Magnify(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .magnify()  // conevrt to double size
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Magnify({
  src: ['original.png'],
  dst: ['33.manify.png']
})