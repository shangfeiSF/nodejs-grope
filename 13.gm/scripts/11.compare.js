#!/usr/bin/env node
var gm = require('gm')
var common = require('./00.common')

function Compare(images) {
  var images = common.prepare(images)

  gm.compare(images.src[0], images.src[1], {
    highlightColor: '#fff',
    file: images.dst[0]
  }, function (err) {
    this._original = true
    console.log('Image-bitdepth: %s'.cyan, images.src[0])
    console.log('Image-original: %s'.cyan, images.src[1])
    common.log.apply(this, arguments)
    console.log('The images are equal: %s'.white, arguments[1])
    console.log('Actual equality: %d'.white, arguments[2])
    console.log('------------------------------------------------------------'.yellow)
  })
}

new Compare({
  src: ['bitdepth-2.jpg', 'original.jpg'],
  dst: ['11.compare-2.jpg']
})

new Compare({
  src: ['bitdepth-4.jpg', 'original.jpg'],
  dst: ['11.compare-4.jpg']
})