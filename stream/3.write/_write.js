var fs = require('fs')
var util = require('util')

var Writable = require('stream').Writable

var argv = process.argv.slice(2)
var model = null
if (argv[0]) {
  switch (argv[0]) {
    case '1':
      model = '_write'
      break
    case '2':
      model = '_write_next'
      break
    case '3':
      model = 'write'
      break
    default:
      model = null
  }
}

if (model == '_write') {
  var write = new Writable()
  write._write = function (chunk, enc, next) {
    console.dir(chunk)
  }
  process.stdin.pipe(write)
}

if (model == '_write_next') {
  var write = new Writable()
  write._write = function (chunk, enc, next) {
    console.dir(chunk)
    next()
  }
  process.stdin.pipe(write)
}


if (model == 'write') {
  var flow = fs.createWriteStream('write.log')
  flow.write('first\n')
  setTimeout(function () {
    flow.end('second\n')
  }, 1000)
  process.stdin.pipe(flow)
}



