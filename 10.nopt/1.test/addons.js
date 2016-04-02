var path = require('path')

module.exports = [
  {
    argvs: '-cl 1 --clear 1',
    expected: {
      config: true,
      length: 1,
      clear: true
    },
    remain: ['1'],
    known: {
      config: Boolean,
      length: Number,
      clear: Boolean
    },
    short: {
      c: '--config',
      l: '--length'
    }
  },
  {
    argvs: '--as 1 -o 1',
    expected: {
      account: true,
      status: 1,
      options: '1'
    },
    remain: [],
    known: {
      account: Boolean,
      status: Number,
      options: String
    },
    short: {
      a: '--account',
      s: '--status',
      o: '--options'
    }
  },
  {
    argvs: '--clear -cle -no-a -no-r',
    expected: {
      clear: true,

      content: true,
      length: true,
      expection: true,
      address: false,
      '-no-r': 'undefined'
    },
    remain: [],
    known: {
      clear: Boolean,

      content: Boolean,
      length: Boolean,
      expection: Boolean,
      address: Boolean,
      represent: Boolean
    },
    short: {
      c: '--content',
      l: '--length',
      e: '--expection',
      a: '--address',
      'no-a': '--no-address',
      r: '--represent'
    }
  }
]