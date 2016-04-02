var colors = require('colors')
var expect = require('chai').expect

describe('async use mocha describe hocks', function () {
  var count = 0
  var intervial = 200

  before(function (done) {
    setTimeout(function () {
      count += 10
      done()
    }, intervial)
  })

  after(function (done) {
    setTimeout(function () {
      count *= 0
      console.log((count + '').green)
      done()
    }, intervial)
  })

  beforeEach(function (done) {
    setTimeout(function () {
      count *= 10
      done()
    }, intervial)
  })

  afterEach(function (done) {
    setTimeout(function () {
      count += 10
      done()
    }, intervial)
  })

  it('[#1] count = 100', function () {
    expect(count).to.be.equal(100)
  })

  it('[#2] count = 1100', function () {
    expect(count).to.be.equal(1100)
  })

  it('[#3] count = 11100', function () {
    expect(count).to.be.equal(11100)
  })

  it('[#4] count = 111100', function () {
    expect(count).to.be.equal(111100)
  })
})

