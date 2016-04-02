var path = require("path")
var nopt = require("nopt")
var task = require('tap').test

task("Pass a string", function (test) {
  var parsed = nopt({
    key: String
  }, {}, ["--key", "This is a string"], 0)

  test.same(parsed.key, "This is a string")
  test.end()
})

task("Pass an empty string", function (test) {
  var parsed = nopt({
    key: String
  }, {}, ["--key"], 0)

  test.same(parsed.key, "")
  test.end()
})

task("~ is resolved to the value of process.env.HOME", function (test) {
  if (!process.env.HOME) process.env.HOME = "/tmp"

  var parsed = nopt({
    key: path
  }, {}, ["--key=~/val"], 0)

  test.same(parsed.key, path.resolve(process.env.HOME, "val"))
  test.end()
})

task("Unknown options are parsed based on itself type", function (test) {
  var parsed = nopt({
    "key": Number
  }, {}, ['--unknown-1=null', '--unknown-2=this is a string', '--no-unknown-3', '--key=1.20'], 0)

  test.equal(parsed['unknown-1'], null)
  test.equal(parsed['unknown-2'], 'this is a string')
  test.equal(parsed['unknown-3'], false)
  test.equal(parsed['key'], 1.2)
  test.end()
})

task("Check type based on name in config", function (test) {
  var parsed = nopt({
    "key-string": {
      name: "String"
    },
    "key-number": {
      name: "Number"
    }
  }, {}, ['--key-string=this is a string', '--key-number=1.20'], 0)

  test.equal(parsed['key-string'], 'this is a string')
  test.equal(parsed['key-number'], 1.2)
  test.end()
})

task("Option that miss name in config are not parsed", function (test) {
  var parsed = nopt({
    "key": {}
  }, null, ['--key=1.20'], 0)

  test.equal(Object.keys(parsed).length, 1)
  test.equal(Object.keys(parsed)[0], 'argv')
  test.end()
})

task("Other tests", function (test) {
  var known = require('./1.test/known')
  var short = require('./1.test/short')

  require('./1.test/config').forEach(function (config) {
    // config：[list, check_map, remain, known, short]

    var list = config[0].split(/\s+/)
    var wanted_map = config[1]
    var remain = config[2]

    var parser = nopt(config[3] || known, config[4] || short, list, 0)

    for (var prop in wanted_map) {
      var wanted = wanted_map[prop]

      var wanted_value = JSON.stringify(wanted)
      var parse_value = JSON.stringify(parser[prop] === undefined ? null : parser[prop])

      if (wanted_value && typeof wanted_value === "object") {
        test.deepEqual(parse_value, wanted_value)
      } else {
        test.equal(parse_value, wanted_value)
      }
    }

    test.deepEqual(parser.argv.remain, remain)
  })
  test.end()
})
