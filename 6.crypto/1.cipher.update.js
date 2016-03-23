var fs = require('fs')
var colors = require('colors')
var crypto = require('crypto')

function Cipher(config) {
  this.cleartext = config.cleartext
  this.password = config.password
  this.encoding = config.encoding

  this.ergodic = config.ergodic || false // 遍历全部加密算法

  if (config.ergodic) {
    this.algorithms = crypto.getCiphers()
    this.ciphers = crypto.getCiphers().map(function (algorithm, index) {
      return {
        me: crypto.createCipher(algorithm, config.password),
        index: index,
        algorithm: algorithm,
        encrypted: ''
      }
    })
    this.log = fs.openSync('log/1.cipher.update.log', 'w')

    this.ergodic_init()
    this.ergodic_start(0)
  } else {
    this.algorithm = config.algorithm || ''
    this.cipher = crypto.createCipher(config.algorithm, config.password)
    this.encrypted = ''

    this.init()
    this.start()
  }
}
Cipher.prototype.init = function () {
  // do nothing
}

Cipher.prototype.start = function () {
  var self = this

  this.encrypted = this.cipher.update(this.cleartext, 'utf-8', this.encoding)

  this.encrypted += this.cipher.final(this.encoding)

  console.log(('-------------------config-------------------').green)
  console.log(([self.algorithm, self.password, self.encoding].join('----')).magenta)
  console.log(('-------------------cleartext-------------------').green)
  console.log((self.cleartext).magenta)
  console.log(('-------------------encrypted-------------------').green)
  console.log((self.encrypted).magenta)
}

Cipher.prototype.ergodic_init = function () {
  // do nothing
}

Cipher.prototype.ergodic_start = function (begin) {
  var self = this
  var begin = self.ciphers[begin]

  begin.encrypted = begin.me.update(self.cleartext, 'utf-8', self.encoding)
  begin.encrypted += begin.me.final(this.encoding)

  var log = [begin.index, begin.algorithm, self.password, self.encoding, begin.encrypted].join('    ') + '\n\n'
  fs.write(self.log, log, function () {
    var offset = 1
    var next = self.ciphers[begin.index + offset]

    while (next && next.algorithm.search('wrap') > -1) {
      fs.writeSync(self.log, [next.index, next.algorithm, self.password, self.encoding].join('    ') + '\n\n')

      offset++
      next = self.ciphers[begin.index + offset]
    }

    next && self.ergodic_start(begin.index + offset)
  })
}

new Cipher({
  cleartext: 'some clear text data',
  // 对称加密算法的密钥
  password: 'rabbit',
  // 'binary' 'base64' 'hex'
  encoding: 'hex',

  algorithm: 'CAST-cbc',
  ergodic: false
})

new Cipher({
  cleartext: 'some clear text data',
  // 对称加密算法的密钥
  password: 'rabbit',
  // 'binary' 'base64' 'hex'
  encoding: 'hex',

  ergodic: true
})