var path = require('path')
var nopt = require('nopt')
var UNIT = require('tap').test

UNIT('Pass a string', function (test) {
  var parsed = nopt({
    key: String
  }, {}, ['--key', 'This is a string'], 0)

  test.same(parsed.key, 'This is a string')
  test.end()
})

UNIT('Pass an empty string', function (test) {
  var parsed = nopt({
    key: String
  }, {}, ['--key'], 0)

  test.same(parsed.key, '')
  test.end()
})

UNIT('~ is resolved to the value of process.env.HOME', function (test) {
  if (!process.env.HOME) process.env.HOME = '/tmp'

  var parsed = nopt({
    key: path
  }, {}, ['--key=~/val'], 0)

  test.same(parsed.key, path.resolve(process.env.HOME, 'val'))
  test.end()
})

UNIT('Unknown options are parsed based on itself type', function (test) {
  var parsed = nopt({
    'key': Number
  }, {}, ['--unknown-1=null', '--unknown-2=this is a string', '--no-unknown-3', '--key=1.20'], 0)

  test.equal(parsed['unknown-1'], null)
  test.equal(parsed['unknown-2'], 'this is a string')
  test.equal(parsed['unknown-3'], false)
  test.equal(parsed['key'], 1.2)
  test.end()
})

UNIT('Check type based on name in config', function (test) {
  var parsed = nopt({
    'key-string': {
      name: 'String'
    },
    'key-number': {
      name: 'Number'
    }
  }, {}, ['--key-string=this is a string', '--key-number=1.20'], 0)

  test.equal(parsed['key-string'], 'this is a string')
  test.equal(parsed['key-number'], 1.2)
  test.end()
})

UNIT('Option that miss name in config are not parsed', function (test) {
  var parsed = nopt({
    'key': {}
  }, null, ['--key=1.20'], 0)

  test.equal(Object.keys(parsed).length, 1)
  test.equal(Object.keys(parsed)[0], 'argv')
  test.end()
})

UNIT('Other tests', function (test) {
  var known = require('./1.test/known')
  var short = require('./1.test/short')

  require('./1.test/config').forEach(function (item) {
    var parser = nopt(
      item.known || known,
      item.short || short,
      item.argvs.split(/\s+/),
      0
    )

    var expected = item.expected

    for (var prop in expected) {
      var expected_value = parser[prop] !== undefined ?
        JSON.stringify(expected[prop]) :
        expected[prop]
      var parse_value = parser[prop] !== undefined ?
        JSON.stringify(parser[prop]) :
        'undefined'

      if (expected_value && typeof expected_value === 'object') {
        test.deepEqual(parse_value, expected_value)
      } else {
        test.equal(parse_value, expected_value)
      }
    }

    test.deepEqual(parser.argv.remain, item.remain)
  })
  test.end()
})
