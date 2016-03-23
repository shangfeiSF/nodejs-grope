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
    this.log = fs.openSync('log/0.cipher.readable.log', 'w')

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
  var self = this

  this.cipher.on('readable', function () {
    var data = this.read()
    if (!data) return
    self.encrypted += data.toString(self.encoding)
  })

  this.cipher.on('end', function () {
    console.log(('-------------------config-------------------').green)
    console.log(([self.algorithm, self.password, self.encoding].join('----')).magenta)
    console.log(('-------------------cleartext-------------------').green)
    console.log((self.cleartext).magenta)
    console.log(('-------------------encrypted-------------------').green)
    console.log((self.encrypted).magenta)
  })
}

Cipher.prototype.start = function () {
  this.cipher.write(this.cleartext)
  this.cipher.end()
}

Cipher.prototype.ergodic_init = function () {
  var self = this

  this.ciphers.forEach(function (cipher) {
    var me = cipher.me

    me.on('readable', function () {
      var data = this.read()
      if (!data) return
      cipher.encrypted += data.toString(self.encoding)
    })

    me.on('end', function () {
      var log = [cipher.index, cipher.algorithm, self.password, self.encoding, cipher.encrypted].join('    ') + '\n\n'

      fs.write(self.log, log, function () {
        var offset = 1
        var next = self.ciphers[cipher.index + offset]

        while (next && next.algorithm.search('wrap') > -1) {
          fs.writeSync(self.log, [next.index, next.algorithm, self.password, self.encoding].join('    ') + '\n\n')

          offset++
          next = self.ciphers[cipher.index + offset]
        }

        if (next) {
          next.me.write(self.cleartext, function () {
            next.me.end()
          })
        }
      })
    })

  })
}

Cipher.prototype.ergodic_start = function (begin) {
  var self = this
  var begin = self.ciphers[begin]

  begin.me.write(self.cleartext, function () {
    begin.me.end()
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