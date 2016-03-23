var fs = require('fs')
var crypto = require('crypto')

function DH(config) {
  this.bits = config.bits
  this.HUMAN = config.HUMAN
  this.ALIEN = config.ALIEN

  this.partakes = {
    human: {},
    alien: {}
  }
  this.log = fs.openSync('./log/4.diffieHellman.log', 'a')

  this.start()
  this.get()
  this.logger()
}

DH.prototype.start = function () {
  var self = this
  var HUMAN = self.HUMAN
  var ALIEN = self.ALIEN

  var human_dh = crypto.createDiffieHellman(self.bits)

  self.partakes.human = {
    dh: human_dh,

    prime: human_dh.getPrime(HUMAN.PRIME),
    generator: human_dh.getGenerator(HUMAN.GENERATOR),

    key: human_dh.generateKeys(HUMAN.KEY),

    public: human_dh.getPublicKey(HUMAN.PUBLIC),
    private: human_dh.getPrivateKey(HUMAN.PRIVATE)
  }

  var alien_dh = crypto.createDiffieHellman(self.partakes.human.prime, HUMAN.PRIME)

  self.partakes.alien = {
    dh: alien_dh,

    prime: alien_dh.getPrime(ALIEN.PRIME),
    generator: alien_dh.getGenerator(ALIEN.GENERATOR),

    key: alien_dh.generateKeys(ALIEN.KEY),

    public: alien_dh.getPublicKey(ALIEN.PUBLIC),
    private: alien_dh.getPrivateKey(ALIEN.PRIVATE)
  }
}

DH.prototype.get = function () {
  var self = this

  var HUMAN = self.HUMAN
  var ALIEN = self.ALIEN

  var human = self.partakes.human
  var alien = self.partakes.alien

  human.secret = human.dh.computeSecret(
    alien.key, ALIEN.KEY,
    HUMAN.SECRET
  )

  alien.secret = alien.dh.computeSecret(
    human.key, HUMAN.KEY,
    ALIEN.SECRET
  )
}

DH.prototype.logger = function () {
  var self = this

  var HUMAN = self.HUMAN
  var ALIEN = self.ALIEN

  var human = self.partakes.human
  var alien = self.partakes.alien

  var human_log = [
      human.prime,
      human.generator,
      human.key,
      human.public,
      human.private,
      human.secret
    ].join('     ') + '\n'

  var alien_log = [
      alien.prime,
      alien.generator,
      alien.key,
      alien.public,
      alien.private,
      alien.secret
    ].join('     ') + '\n'

  var alien_to_human = [
    (new Buffer(alien.prime, ALIEN.PRIME)).toString(HUMAN.PRIME),
    (new Buffer(alien.generator, ALIEN.GENERATOR)).toString(HUMAN.GENERATOR),
    alien.key,
    alien.public,
    alien.private,
    (new Buffer(alien.secret, ALIEN.SECRET)).toString(HUMAN.SECRET),
  ].join('   ')

  fs.writeSync(this.log, human_log + alien_log + alien_to_human + '\n')
  fs.closeSync(this.log)
}

new DH({
  bits: 32,
  HUMAN: {
    PRIME: 'base64',
    GENERATOR: 'hex',

    KEY: 'hex',
    PUBLIC: 'hex',
    PRIVATE: 'base64',

    SECRET: 'hex'
  },
  ALIEN: {
    PRIME: 'hex',
    GENERATOR: 'base64',

    KEY: 'base64',
    PUBLIC: 'base64',
    PRIVATE: 'hex',

    SECRET: 'base64'
  }
})