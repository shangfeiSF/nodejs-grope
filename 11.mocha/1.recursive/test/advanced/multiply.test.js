var multiply = require('../../src/multiply');
var expect = require('chai').expect;

describe('multiply', function () {
  it('1 multiple 1 except to 1', function () {
    expect(multiply(1, 1)).to.be.equal(1)
  })
  
  it('any multiple 0 except to 0', function () {
    expect(multiply(199, 0)).to.be.equal(0)
  })
})
