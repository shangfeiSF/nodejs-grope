var fetch = require('node-fetch')
var expect = require('chai').expect

describe('promise with mocha test', function () {
  it('fetch https://api.github.com', function () {
    return fetch('https://api.github.com')
      .then(function (res) {
        return res.json()
      }).then(function (json) {
        expect(json).to.be.an('object');
      })
  })
})
// mocha -t 10000 promise.test.js