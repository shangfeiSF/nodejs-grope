var path = require("path")

module.exports = [
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