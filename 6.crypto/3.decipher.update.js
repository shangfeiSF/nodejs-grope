var fs = require('fs')
var crypto = require('crypto')
var readline = require('readline')

function Decipher(config) {
  var self = this

  this.deciphers = []
  this.algorithm_no_support = /wrap|gcm|ccm|GCM|CCM/

  this.cipher_log = fs.createReadStream('./log/1.cipher.update.log')
  this.decipher_log = fs.openSync('./log/3.decipher.update.log', 'w')

  this.readline = readline.createInterface({
    input: self.cipher_log,
    terminal: false
  })

  this.init(config.begin)
}

Decipher.prototype.init = function (begin) {
  var self = this

  self.readline.on('line', function (line) {
    if (!line) return

    var data = line.match(/([\w\-]+)/g)
    var algorithm = data[1]
    var password = data[2]

    var me = algorithm.search(self.algorithm_no_support) < 0 ?
      crypto.createDecipher(algorithm, password) :
      null

    var decipher = {
      index: parseInt(data[0]),
      algorithm: data[1],
      password: data[2],
      encoding: data[3],
      encrypted: data[4],
      me: me,
      cleartext: ''
    }

    self.deciphers.push(decipher)
  })

  self.readline.on('close', function () {
    self.monitor()
    self.start(begin)
  })
}

Decipher.prototype.monitor = function () {
  // do nothing
}

Decipher.prototype.start = function (begin) {
  var self = this
  var begin = self.deciphers[begin]

  begin.cleartext = begin.me.update(begin.encrypted, 'hex', 'utf-8')
  begin.cleartext += begin.me.final('utf-8')

  var log = [begin.index, begin.algorithm, begin.password, begin.encoding, begin.cleartext].join('    ') + '\n\n'

  fs.write(self.decipher_log, log, function () {
    var offset = 1
    var next = self.deciphers[begin.index + offset]

    while (next && !next.me) {
      fs.writeSync(self.decipher_log, [next.index, next.algorithm, next.password, next.encoding, next.encrypted].join('    ') + '\n\n')

      offset++
      next = self.deciphers[begin.index + offset]
    }

    if (next && next.me) {
      self.start(begin.index + offset)
    }
  })
}

new Decipher({
  begin: 0
})