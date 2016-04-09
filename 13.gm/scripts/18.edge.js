#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Edge(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .edge(1)
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Edge({
  src: ['original.png'],
  dst: ['18.edge.jpg']
})
