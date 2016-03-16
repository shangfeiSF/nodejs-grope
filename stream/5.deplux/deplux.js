var fs = require('fs')
var util = require('util')

var Readable = require('stream').Readable
var Writable = require('stream').Writable
var Duplex = require('stream').Duplex

function Media(options) {
  if (!(this instanceof Media)) {
    return new Media(options)
  }
  Duplex.call(this, options)
}

util.inherits(Media, Duplex)

Media.prototype.timestamp = function () {
  var date = new Date()
  var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
  var timestamp = []
  stampfn.forEach(function (value) {
    timestamp.push(date[value]())
  })
  return timestamp.join(":")
}

Media.prototype._write = function (chunk, enc, callback) {
  var buf = this.timestamp() + "---" + chunk.toString('utf-8') + '\n'
  fs.writeSync(destination, buf)
  this.push(buf)
  callback()
}

Media.prototype._read = function (size) {
  var chunk = this.read()
  if (!chunk) return

  this.push(chunk.toString('utf-8').split('---').pop())
}

var destination = fs.openSync('destination.log', 'a')
var source = new Readable({
  encoding: 'utf8'
})

var char = 97
source._read = function (size) {
  var self = this
  if (char > 'z'.charCodeAt(0)) return this.push(null)
  setTimeout(function () {
    self.push(String.fromCharCode(char++))
  }, 100)
}

var media = new Media()

media.on('readable', function () {
  var chunk = this.read()
  if (!chunk) {
    return
  }
  var buf = this.timestamp() + "###" + chunk.toString('utf-8')
  fs.writeSync(destination, buf)
})

media.on("finish", function () {
  fs.closeSync(destination)
})

source.pipe(media)