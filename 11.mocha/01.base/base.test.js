var add = require('./add.js')
/* mocha不带断言库，必须先引入断言库 */
var expect = require('chai').expect
var should = require('chai').should()

/* describe 块称为"测试套件" test suite 表示一组相关的测试 */
/* it 块称为"测试用例" test case 表示一个独立的测试 */

describe('add', function () {
  it('1 plus 1 is except to 2', function () {
    expect(add(1, 1)).to.be.equal(2)
  })
})

describe('Array', function () {
  describe('#indexOf()', function () {
    var array = [1, 2, 3]
    
    it('should return -1 when the value is not present', function () {
      array.indexOf(5).should.equal(-1)
    })
    
    it('should return index when the value is present', function () {
      array.indexOf(2).should.equal(1)
    })
  })
})

// mocha base.test.js
