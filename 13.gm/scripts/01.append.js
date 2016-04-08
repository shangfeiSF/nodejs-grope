var util = require('util')
var fs = require('fs')
var path = require('path')

var gm = require('gm')
var colors = require('colors')
var nopt = require("nopt")
var prepare = require('./00.prepare')

var imageMagick = gm.subClass({
  imageMagick: true
})

function Append(images) {
  var options = nopt({
    relative: Boolean
  }, {
    'rel': ['--relative', 'true'],
    'abs': ['--relative', 'false']
  }, process.argv, 2)

  var images = images

  if (options.relative) {
    images.dst = images.dst.map(function (image) {
      return image + '_relative.png'
    })
  }

  images = prepare(images, options.relative)

  imageMagick(images.src[0])
    .append(images.src[1])
    .append()
    .background('#222')
    .write(images.dst, function (err) {
      if (err) return

      var error = err
      var arg_1 = arguments[1]
      var arg_2 = arguments[2]
      var commands = arguments[3].split(/\s/g)

      console.log('[Error] --- ' + error)
      console.log('[Arg1] --- ' + arg_1)
      console.log('[Arg2] --- ' + arg_2)
      console.log('[Commands] --- ')
      commands.forEach(function (cmd) {
        console.log(cmd.green)
      })

      var log = fs.openSync('./log/commands.log', 'a')
      fs.writeSync(log, arguments[3])
      fs.writeSync(log, '\r')
      fs.close(log)

      console.log('[Create] --- ' + (this.outname + '').yellow)
    })
}

new Append({
  src: ['lost.png', 'original.jpg'],
  dst: ['01.append.png']
})
