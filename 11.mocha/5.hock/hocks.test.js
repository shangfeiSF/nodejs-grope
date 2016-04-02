var colors = require('colors')
var expect = require('chai').expect

describe('sync use mocha describe hocks', function () {
  var count = 0

  before(function () {
    count += 10
  })

  after(function () {
    count *= 0
    console.log((count + '').green)
  })

  beforeEach(function () {
    count *= 10
  })

  afterEach(function () {
    count += 10
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
