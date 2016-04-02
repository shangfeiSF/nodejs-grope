var path = require('path')

module.exports = [
  {
    argvs: '-v',
    expected: {
      version: true
    },
    remain: [],
  },
  // 前缀'-'的数量>=1即可
  {
    argvs: '----v',
    expected: {
      version: true
    },
    remain: [],
  },
  {
    argvs: 'build --no-v -s',
    expected: {
      version: 'undefined',
      loglevel: 'silent'
    },
    remain: ['build'],
  },
  {
    argvs: 'build --no-version -s connect -d',
    expected: {
      version: false,
      loglevel: 'info'
    },
    remain: ['build', 'connect'],
  },
  {
    argvs: 'connect --registry https:////github.com/',
    expected: {},
    remain: ['connect'],
  },
  {
    argvs: 'connect --registry https://github.com/',
    expected: {
      registry: 'https://github.com/'
    },
    remain: ['connect'],
  },
  {
    argvs: 'connect --no-reg https://github.com/',
    expected: {
      registry: 'undefined'
    },
    remain: ['connect', 'https://github.com/'],
  },
  {
    argvs: '--color=true',
    expected: {
      color: true
    },
    remain: [],
  },
  {
    argvs: '--color false',
    expected: {
      color: false
    },
    remain: [],
  },
  {
    argvs: '--no-color',
    expected: {
      color: false
    },
    remain: [],
  },
  {
    argvs: '--no-color true',
    expected: {
      color: false
    },
    remain: [],
  },
  {
    argvs: '--no-color false',
    expected: {
      color: true
    },
    remain: [],
  },
  {
    argvs: '--color inherit',
    expected: {
      color: 'inherit'
    },
    remain: [],
  },
  {
    argvs: '--color 100',
    expected: {
      color: true
    },
    remain: ['100'],
  },
  {
    argvs: '--color=#ff4400',
    expected: {
      color: true
    },
    remain: ['#ff4400'],
  },
  {
    argvs: 'log --logfd=10',
    expected: {
      logfd: 10
    },
    remain: ['log'],
  }
]