var expect = require('chai').expect

describe('setTimeout 4000 to mocha test', function () {
  it('mocha -t [timeout]', function (done) {
    var x = true
    var f = function () {
      x = false
      expect(x).to.be.not.ok
      done()
    }
    setTimeout(f, 4000)
  })
})
// mocha -t 5000 timeout.test.js


