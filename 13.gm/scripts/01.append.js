#!/usr/bin/env node
var common = require('./00.common')
var imageMagick = require('gm').subClass({
  imageMagick: true
})

function Append(images) {
  var images = common.prepare(images)

  imageMagick(images.src[0])
    .append(images.src[1])
    .append()
    .background('#00ff00')
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Append({
  src: ['lost.png', 'original.jpg'],
  dst: ['01.append.png']
})