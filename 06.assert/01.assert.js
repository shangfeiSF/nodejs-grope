var assert = require('assert')
var colors = require('colors')

function Detect() {
  this.use_assert_option = {
    number: [-1, 0, 1],
    boolean: [true, false],
    object: [{}, {test: 'ok'}],
    string: ['', 'Hello world'],
    array: [[], [0, 1, 2]]
  }
  this.use_deepEqual_option = {
    1: {dog: {name: 'hello'}},
    2: {dog: {name: 'world'}},
    3: {dog: {name: 'hello'}},
    4: Object.create({dog: {name: 'hello'}})
  }
  this.use_deepStrictEqual_option = {
    1: {dog: {age: '3'}},
    2: {dog: {age: '3'}},
    3: {dog: {age: 3}}
  }
}

Detect.prototype.use_assert = function () {
  console.log(('-----------------assert-----------------').green)
  for (var p in this.use_assert_option) {
    this.use_assert_option[p].forEach(function (value) {
      try {
        assert(value)
      } catch (error) {
        console.log(error.message.cyan)
      }
    })
  }
  console.log(('-----------------assert.ok-----------------').green)
  for (var p in this.use_assert_option) {
    this.use_assert_option[p].forEach(function (value) {
      try {
        var message = '[' + typeof value + '] ' + value + ' is not equal(==) true'
        assert.ok(value, message)
      } catch (error) {
        console.log(error.message.cyan)
      }
    })
  }
}

Detect.prototype.use_deepEqual = function () {
  console.log(('-----------------deepEqual(==)-----------------').green)
  for (var p in this.use_deepEqual_option) {
    try {
      assert.deepEqual(
        this.use_deepEqual_option['1'],
        this.use_deepEqual_option[p],
        'pop#1 is not deep equal(==) to pop#' + p
      )
    } catch (error) {
      console.log(error.message.cyan)
    }
  }
}

Detect.prototype.use_deepStrictEqual = function () {

  console.log(('-----------------deepStrictEqual(===)-----------------').green)
  for (var p in this.use_deepStrictEqual_option) {
    try {
      assert.deepStrictEqual(
        this.use_deepStrictEqual_option['1'],
        this.use_deepStrictEqual_option[p],
        'pop#1 is not deep strict equal(===) to pop#' + p
      )
    } catch (error) {
      console.log(error.message.cyan)
    }
  }

}

var detect = new Detect()
detect.use_assert()
detect.use_deepEqual()
detect.use_deepStrictEqual()