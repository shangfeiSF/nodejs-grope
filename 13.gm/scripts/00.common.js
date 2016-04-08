var fs = require('fs')
var util = require('util')
var path = require('path')

var nopt = require("nopt")
var colors = require('colors')

module.exports = {
  prepare: function (images) {
    var options = nopt({
      relative: Boolean
    }, {
      'rel': ['--relative', 'true'],
      'abs': ['--relative', 'false']
    }, process.argv, 2)

    var imagesDir = '../imgs'
    var base = path.join(__dirname, imagesDir)

    if (options.relative) {
      base = imagesDir
      images.dst = images.dst.map(function (name) {
        return name + '_relative' + path.extname(name)
      })
    }

    var result = {}

    for (var prop in images) {
      if (!images.hasOwnProperty(prop)) continue

      result[prop] = images[prop].map(function (name) {
        return prop.split('_').concat(name).reduce(function (prev, cur) {
          return path.join(prev, cur)
        }, base)
      })
    }

    return result
  },

  log: function () {
    if (arguments[0]) return

    var error = arguments[0]
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
  }
}
