#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Extent(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .resize(400, 300)  // resize width=400 is ok, but resize height=300 is falied
    .extent(400, 400)
    .background('#36AEC0')
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Extent({
  src: ['original.jpg'],
  dst: ['22.extent.jpg']
})