var add = require('../src/add.js')
var expect = require('chai').expect

describe('add', function () {
  it.only('1 plus 1 is except to 2', function () {
    expect(add(1, 1)).to.be.equal(2)
  })

  it('any plus 0 is except to any', function () {
    expect(add(1, 0)).to.be.equal(1)
  })
})