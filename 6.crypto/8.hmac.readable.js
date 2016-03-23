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

  this.log = fs.openSync('log/8.hmac.readable.log', 'w')

  this.ergodic_init()
  this.ergodic_start(0)
}

HMAC.prototype.ergodic_init = function () {
  var self = this

  this.hashes.forEach(function (hash) {
    var me = hash.me

    me.on('readable', function () {
      var data = this.read()
      if (!data) return
      hash.encrypted += data.toString(self.encoding)
    })

    me.on('end', function () {
      var log = [hash.index, hash.algorithm, self.key, self.encoding, hash.encrypted].join('    ') + '\n\n'

      fs.write(self.log, log, function () {
        var offset = 1
        var next = self.hashes[hash.index + offset]

        next && next.me.write(self.cleartext, function () {
          next.me.end()
        })
      })
    })

  })
}

HMAC.prototype.ergodic_start = function (begin) {
  var self = this
  var begin = self.hashes[begin]

  begin.me.write(self.cleartext, function () {
    begin.me.end()
  })
}


new HMAC({
  key: 'rabbit',
  cleartext: 'some clear text data',
  encoding: 'hex'
})