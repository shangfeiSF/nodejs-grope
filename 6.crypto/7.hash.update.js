var fs = require('fs')
var colors = require('colors')
var crypto = require('crypto')

function HASH(config) {
  this.cleartext = config.cleartext
  this.encoding = config.encoding

  this.algorithms = crypto.getHashes()

  this.hashes = crypto.getHashes().map(function (algorithm, index) {
    return {
      me: crypto.createHash(algorithm),
      index: index,
      algorithm: algorithm,
      encrypted: ''
    }
  })

  this.log = fs.openSync('log/7.hash.update.log', 'w')

  this.ergodic_init()
  this.ergodic_start(0)
}

HASH.prototype.ergodic_init = function () {
}

HASH.prototype.ergodic_start = function (begin) {
  var self = this
  var begin = self.hashes[begin]

  begin.me.update(self.cleartext)
  begin.encrypted += begin.me.digest(self.encoding)

  var log = [begin.index, begin.algorithm, self.encoding, begin.encrypted].join('    ') + '\n\n'

  fs.write(self.log, log, function () {
    var next = self.hashes[begin.index + 1]
    next && self.ergodic_start(begin.index + 1)
  })
}


new HASH({
  cleartext: 'some clear text data',
  encoding: 'hex'
})