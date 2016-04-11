#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Minify(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .minify()  // conver to half size
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Minify({
  src: ['original.png'],
  dst: ['35.minify.png']
})