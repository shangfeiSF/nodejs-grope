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

  this.log = fs.openSync('log/6.hash.readable.log', 'w')

  this.ergodic_init()
  this.ergodic_start(0)
}

HASH.prototype.ergodic_init = function () {
  var self = this

  this.hashes.forEach(function (hash) {
    var me = hash.me

    me.on('readable', function () {
      var data = this.read()
      if (!data) return
      hash.encrypted += data.toString(self.encoding)
    })

    me.on('end', function () {
      var log = [hash.index, hash.algorithm, self.encoding, hash.encrypted].join('    ') + '\n\n'

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

HASH.prototype.ergodic_start = function (begin) {
  var self = this
  var begin = self.hashes[begin]

  begin.me.write(self.cleartext, function () {
    begin.me.end()
  })
}


new HASH({
  cleartext: 'some clear text data',
  encoding: 'hex'
})