#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Despeckle(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .despeckle()
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Despeckle({
  src: ['original.png'],
  dst: ['15.despeckle.jpg']
})