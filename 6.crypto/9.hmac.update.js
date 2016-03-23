var fs = require('fs')
var colors = require('colors')
var crypto = require('crypto')

function HMAC(config) {
  this.cleartext = config.cleartext
  this.encoding = config.encoding
  this.key = config.key

  this.algorithms = crypto.getHashes()

  this.hashes = crypto.getHashes().map(function (algorithm, index) {
    return {
      me: crypto.createHmac(algorithm, config.key),
      index: index,
      algorithm: algorithm,
      encrypted: ''
    }
  })

  this.log = fs.openSync('log/9.hmac.update.log', 'w')

  this.ergodic_init()
  this.ergodic_start(0)
}

HMAC.prototype.ergodic_init = function () {
}

HMAC.prototype.ergodic_start = function (begin) {
  var self = this
  var begin = self.hashes[begin]

  begin.me.update(self.cleartext)
  begin.encrypted += begin.me.digest(self.encoding)

  var log = [begin.index, begin.algorithm, self.key, self.encoding, begin.encrypted].join('    ') + '\n\n'

  fs.write(self.log, log, function () {
    var next = self.hashes[begin.index + 1]
    next && self.ergodic_start(begin.index + 1)
  })
}


new HMAC({
  key: 'rabbit',
  cleartext: 'some clear text data',
  encoding: 'hex'
})