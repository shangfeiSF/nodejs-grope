#!/usr/bin/env node
var gm = require('gm')
var common = require('./00.common')

function Comment(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    .comment('%m:%f %wx%h')
    .comment('original pic')
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Comment({
  src: ['original.png'],
  dst: ['10.comment.jpg']
})