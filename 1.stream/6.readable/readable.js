var util = require('util')
var stream = require('stream')

function Source(options) {
  if (!(this instanceof Source)) {
    return new Source(options)
  }

  stream.Duplex.call(this, options)

  this.timestamp = []

  this.timer = setInterval(this.addTime.bind(this), 100)
}
util.inherits(Source, stream.Duplex)

Source.prototype.addTime = function () {
  this.timestamp.push((new Date()).toString())
}

Source.prototype.stopTimer = function () {
  if (this.timer) clearInterval(this.timer)
  this.timer = null
}

Source.prototype._read = function () {
  var self = this
  while (this.timestamp.length) {
    var chunk = this.timestamp.shift() + '\n'
    if (!self.push(chunk)) {
      break
    }
  }
  if (self.timer) {
    setTimeout(self._read.bind(self), 1000)
  } else {
    self.push(null)
  }
}

Source.prototype._write = function (chunk, encode, done) {
  console.log('write: ', chunk.toString())
  done()
}

var source = new Source()

source.on('readable', function () {
  var chunk
  while (null !== (chunk = this.read())) {
    console.log('----------------------------------------')
    console.log(chunk.toString())
  }
})

setTimeout(function () {
  source.stopTimer()
  console.log('----------------------------------------')
  source.write('Hello ')
  source.write('World')
  source.end()
}, 3000)