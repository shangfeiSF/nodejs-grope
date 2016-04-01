var util = require("util")
var url = require("url")
var path = require("path")
var Stream = require("stream")
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
  var shorthands = {
    "v": ["--version"],

    "s": ["--loglevel", "silent"],

    "silent": ["--loglevel", "silent"],

    "d": ["--loglevel", "info"],
    "dd": ["--loglevel", "verbose"],

    "verbose": ["--loglevel", "verbose"],

    "ddd": ["--loglevel", "silly"],
    "reg": ["--registry"],
    "noreg": ["--no-registry"],

    "no-reg": ["--no-registry"],
    "h": ["--usage"],
    "H": ["--usage"],
    "?": ["--usage"],
    "help": ["--usage"],

    "f": ["--force"],
    "l": ["--long"],

    "desc": ["--description"],
    "no-desc": ["--no-description"],

    "p": ["--parseable"],
    "porcelain": ["--parseable"],

    "g": ["--global"],
    "local": ["--no-global"]
  }

  var types = {
    version: Boolean,
    loglevel: ["silent", "win", "error", "warn", "info", "verbose", "silly"],
    registry: url,
    color: ["always", Boolean],
    logfd: [Number, Stream],

    aoa: Array,
    nullstream: [null, Stream],
    date: Date,
    str: String,
    browser: String,
    cache: path,
    depth: Number,
    description: Boolean,
    dev: Boolean,
    editor: path,
    force: Boolean,
    global: Boolean,
    globalconfig: path,
    group: [String, Number],
    gzipbin: String,
    long: Boolean,
    "node-version": [false, String],
    npaturl: url,
    npat: Boolean,
    "onload-script": [false, String],
    outfd: [Number, Stream],
    parseable: Boolean,
    pre: Boolean,
    prefix: path,
    proxy: url,
    "rebuild-bundle": Boolean,
    searchopts: String,
    searchexclude: [null, String],
    shell: path,
    t: [Array, String],
    tag: String,
    tar: String,
    tmp: path,
    "unsafe-perm": Boolean,
    usage: Boolean,
    user: String,
    username: String,
    userconfig: path,
    viewer: path,
    _exit: Boolean,
    path: path
  }

  var configs = [
    // [list, check_map, remain, types, shorthands]
    ["-v", {
      version: true
    }, []],
    ["---v", {
      version: true
    }, []],

    ["ls -s --no-reg connect -d", {
      loglevel: "info",
      registry: null
    }, ["ls", "connect"]],

    ["ls ---s foo", {
      loglevel: "silent"
    }, ["ls", "foo"]],

    ["ls --registry http://///mock.npm.org", {}, ["ls"]],

    ["--registry http://www.npm.org/", {
      registry: 'http://www.npm.org/'
    }, []],

    ["--no-registry", {
      registry: null
    }, []],

    ["--color=true", {
      color: true
    }, []],
    ["--color false", {
      color: false
    }, []],
    ["--no-color", {
      color: false
    }, []],
    ["--no-color true", {
      color: false
    }, []],
    ["--no-color false", {
      color: true
    }, []],

    ["--logfd=10", {
      logfd: 10
    }, []],

    ["--color --logfd 7", {
      color: true,
      logfd: 7
    }, []],

    ["--tmp=/tmp -tar=gtar", {
      tmp: "/tmp",
      tar: "gtar"
    }, []],

    ["--tmp=tmp -tar=gtar", {
      tmp: path.resolve(process.cwd(), "tmp"),
      tar: "gtar"
    }, []],
    ["--logfd x", {}, []],
    ["a -true -- -no-false", {true: true}, ["a", "-no-false"]],
    ["a -no-false", {false: false}, ["a"]],
    ["a -no-no-true", {true: true}, ["a"]],
    ["a -no-no-no-false", {false: false}, ["a"]],
    ["---NO-no-No-no-no-no-nO-no-no" + "-No-no-no-no-no-no-no-no-no" + "-no-no-no-no-NO-NO-no-no-no-no-no-no" + "-no-body-can-do-the-boogaloo-like-I-do", {"body-can-do-the-boogaloo-like-I-do": false}, []],
    ["we are -no-strangers-to-love " + "--you-know=the-rules --and=so-do-i " + "---im-thinking-of=a-full-commitment " + "--no-you-would-get-this-from-any-other-guy " + "--no-gonna-give-you-up " + "-no-gonna-let-you-down=true " + "--no-no-gonna-run-around false " + "--desert-you=false " + "--make-you-cry false " + "--no-tell-a-lie " + "--no-no-and-hurt-you false", {
      "strangers-to-love": false,
      "you-know": "the-rules",
      "and": "so-do-i",
      "you-would-get-this-from-any-other-guy": false,
      "gonna-give-you-up": false,
      "gonna-let-you-down": false,
      "gonna-run-around": false,
      "desert-you": false,
      "make-you-cry": false,
      "tell-a-lie": false,
      "and-hurt-you": false
    }, ["we", "are"]],
    ["-t one -t two -t three", {t: ["one", "two", "three"]}, []],
    ["-t one -t null -t three four five null", {t: ["one", "null", "three"]}, ["four", "five", "null"]],
    ["-t foo", {t: ["foo"]}, []], ["--no-t", {t: ["false"]}, []],
    ["-no-no-t", {t: ["true"]}, []],
    ["-aoa one -aoa null -aoa 100", {aoa: ["one", null, '100']}, []],
    ["-str 100", {str: "100"}, []],
    ["--color always", {color: "always"}, []],
    ["--no-nullstream", {nullstream: null}, []],
    ["--nullstream false", {nullstream: null}, []],
    ["--notadate=2011-01-25", {notadate: "2011-01-25"}, []],
    ["--date 2011-01-25", {date: new Date("2011-01-25")}, []],
    ["-cl 1", {
      config: true,
      length: 1
    }, [], {config: Boolean, length: Number, clear: Boolean}, {
      c: "--config",
      l: "--length"
    }],
    ["--acount bla", {"acount": true}, ["bla"], {
      account: Boolean,
      credentials: Boolean,
      options: String
    }, {a: "--account", c: "--credentials", o: "--options"}],
    ["--clear", {clear: true}, [], {
      clear: Boolean,
      con: Boolean,
      len: Boolean,
      exp: Boolean,
      add: Boolean,
      rep: Boolean
    }, {
      c: "--con",
      l: "--len",
      e: "--exp",
      a: "--add",
      r: "--rep"
    }],
    ["--file -", {"file": "-"}, [], {file: String}, {}],
    ["--file -", {"file": true}, ["-"], {file: Boolean}, {}],
    ["--path", {"path": null}, []],
    ["--path .", {"path": process.cwd()}, []]
  ]

  // config：[list, check_map, remain, types, shorthands]
  configs.forEach(function (config) {
    var list = config[0].split(/\s+/)
    var wanted_map = config[1]
    var remain = config[2]

    var parser = nopt(config[3] || types, config[4] || shorthands, list, 0)

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
