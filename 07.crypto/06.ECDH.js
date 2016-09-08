var fs = require('fs')
var crypto = require('crypto')

function ECDH(config) {
  this.curves = crypto.getCurves()

  this.HUMAN = config.HUMAN
  this.ALIEN = config.ALIEN

  this.partakes = {
    human: {},
    alien: {}
  }
  this.log = fs.openSync('./log/06.ECDH.log', 'w')

  this.start()
  this.get()
  this.logger()
}

ECDH.prototype.start = function () {
  var self = this
  var HUMAN = self.HUMAN
  var ALIEN = self.ALIEN

  self.curves.forEach(function (curve) {
    var human_ecdh = crypto.createECDH(curve)

    self.partakes.human[curve] = {
      ecdh: human_ecdh,
      key: human_ecdh.generateKeys(HUMAN.KEY, HUMAN.FORMAT),

      public: human_ecdh.getPublicKey(HUMAN.PUBLIC, HUMAN.FORMAT),
      private: human_ecdh.getPrivateKey(HUMAN.PRIVATE)
    }

    var alien_ecdh = crypto.createECDH(curve)

    self.partakes.alien[curve] = {
      ecdh: alien_ecdh,
      key: alien_ecdh.generateKeys(ALIEN.KEY, ALIEN.FORMAT),

      public: alien_ecdh.getPublicKey(ALIEN.PUBLIC, ALIEN.FORMAT),
      private: alien_ecdh.getPrivateKey(ALIEN.PRIVATE)
    }
  })
}

ECDH.prototype.get = function () {
  var self = this

  var HUMAN = self.HUMAN
  var ALIEN = self.ALIEN

  self.curves.forEach(function (curve) {
    var human = self.partakes.human[curve]
    var alien = self.partakes.alien[curve]

    human.secret = human.ecdh.computeSecret(
      alien.key, ALIEN.KEY,
      HUMAN.SECRET
    )

    alien.secret = alien.ecdh.computeSecret(
      human.key, HUMAN.KEY,
      ALIEN.SECRET
    )
  })
}

ECDH.prototype.logger = function () {
  var self = this

  var HUMAN = self.HUMAN
  var ALIEN = self.ALIEN

  self.curves.forEach(function (curve) {
    var human = self.partakes.human[curve]
    var alien = self.partakes.alien[curve]

    var logger = '-----------------------' + curve + '-----------------------\n'

    var human_log = [
      'Human-----' + human.secret + '\n',
      '\tkey=' + human.key + '\n',
      '\tpublic=' + human.public + '\n',
      '\tprivate=' + human.private + '\n'
    ].join('') + '\n'

    var alien_log = [
      'Alien-----' + alien.secret + '\n',
      '\tkey=' + alien.key + '\n',
      '\tpublic=' + alien.public + '\n',
      '\tprivate=' + alien.private + '\n'
    ].join('') + '\n'

    var alien_to_human = [
      'Alien_to_Human-----' + (new Buffer(alien.secret, ALIEN.SECRET)).toString(HUMAN.SECRET) + '\n',
      '\tkey=' + alien.key + '\n',
      '\tpublic=' + alien.public + '\n',
      '\tprivate=' + alien.private + '\n',
    ].join('')

    fs.writeSync(self.log, logger + human_log + alien_log + alien_to_human + '\n')
  })

  fs.closeSync(this.log)
}

new ECDH({
  HUMAN: {
    FORMAT: 'compressed',

    KEY: 'hex',
    PUBLIC: 'hex',
    PRIVATE: 'base64',

    SECRET: 'hex'
  },
  ALIEN: {
    FORMAT: 'uncompressed',

    KEY: 'base64',
    PUBLIC: 'base64',
    PRIVATE: 'hex',

    SECRET: 'base64'
  }
})