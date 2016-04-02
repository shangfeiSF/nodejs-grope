var request = require('superagent')
var expect = require('chai').expect

describe('http request async to mocha test', function () {
  it('get https://api.github.com', function (done) {
    request
      .get('https://api.github.com')
      .end(function (err, res) {
        expect(res).to.be.an('object')
        done()
      })
  })
})
// mocha -t 10000 async.test.js

