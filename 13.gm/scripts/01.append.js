#!/usr/bin/env node
var gm = require('gm')
var common = require('./00.common')

function Append(images, direction) {
  var images = common.prepare(images)

  var puzzle = gm(images.src[0])
    .append(images.src[1], images.src[2])

  // 拼接的方向只能设置一次, 而且链式位置随意

  if (direction) {
    puzzle = puzzle.append(direction)
      .append(images.src[1])
      .append(images.src[2])
  } else {
    puzzle = puzzle
      .append(images.src[1])
      .append(images.src[2])
  }

  puzzle.background('#36AEC0')
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Append({
  src: ['original.png', 'lost.png', 'morpher.jpg'],
  dst: ['01.append-left-to-right.jpg']
}, true)

new Append({
  src: ['original.png', 'lost.png', 'morpher.jpg'],
  dst: ['01.append-top-to-button.png']
})
