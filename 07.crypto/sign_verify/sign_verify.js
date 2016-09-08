var fs = require('fs')
var crypto = require('crypto')

function SV(config) {
  this.correct = config.correct
  this.garbled = 'miao miao miao, this is a garbled message!'

  this.algorithm = config.algorithm
  this.encoding = config.encoding

  this.private = (fs.readFileSync('server.pem')).toString()
  this.public = (fs.readFileSync('cert.pem')).toString()
  this.signer = null
  this.verify = null

  this.generate_signer()
}

SV.prototype.generate_signer = function () {
  var self = this

  var sign = crypto.createSign(self.algorithm)
  sign.update(self.correct)

  this.signer = sign.sign(self.private, self.encoding)
}

SV.prototype.transmit = function (correct) {
  var self = this
  return {
    correct: correct ? self.correct : self.garbled,
    signer: self.signer
  }
}

SV.prototype.receive = function (package) {
  var self = this

  var verify = crypto.createVerify(self.algorithm)
  verify.update(package.correct)

  this.verify = verify.verify(self.public, package.signer, self.encoding)
  console.log('-----------------------------------------------------')
  console.log(self.correct)
  console.log(self.signer)
  console.log('-----------------------------------------------------')
  console.log(package.correct)
  console.log(self.verify)
  console.log('-----------------------------------------------------\n')
}

var sv = new SV({
  correct: 'hu hu hu',
  algorithm: 'RSA-SHA256',
  encoding: 'hex'
})

var package_1 = sv.transmit(true)
sv.receive(package_1)

var package_2 = sv.transmit(false)
sv.receive(package_2)