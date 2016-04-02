var path = require('path')

module.exports = [
  {
    argvs: '-v',
    expected: {
      version: true
    },
    remain: [],
  },
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
      version: false,
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
    argvs: 'connect --registry',
    expected: {
      registry: 'undefined'
    },
    remain: ['connect'],
  },
  {
    argvs: 'connect --registry https:////github.com/',
    expected: {
      registry: 'undefined'
    },
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
  },
  {
    argvs: '--logfd xxx',
    expected: {
      logfd: 'undefined'
    },
    remain: [],
  },

  {
    argvs: '--tmp=./tmp -tar gtar',
    expected: {
      tmp: path.resolve(process.cwd(), './tmp'),
      tar: 'gtar'
    },
    remain: [],
  },

  {
    argvs: 'flag -true',
    expected: {
      true: true,
    },
    remain: ['flag'],
  },
  {
    argvs: 'flag -no-true',
    expected: {
      true: false,
    },
    remain: ['flag'],
  },
  {
    argvs: 'flag -no-no-true',
    expected: {
      true: true,
    },
    remain: ['flag'],
  },

  {
    argvs: 'flag -false',
    expected: {
      false: true,
    },
    remain: ['flag'],
  },
  {
    argvs: 'flag -no-false',
    expected: {
      false: false,
    },
    remain: ['flag'],
  },
  {
    argvs: 'flag -no-no-false',
    expected: {
      false: true,
    },
    remain: ['flag'],
  },

  {
    argvs: 'flag -true=null',
    expected: {
      true: null,
    },
    remain: ['flag'],
  },
  {
    argvs: 'flag -no-true null',
    expected: {
      'no-true': 'undefined'
    },
    remain: ['flag', 'null'],
  },
  {
    argvs: 'flag -false=null',
    expected: {
      false: null,
    },
    remain: ['flag'],
  },
  {
    argvs: 'flag -no-false=null',
    expected: {
      'no-false': 'undefined'
    },
    remain: ['flag', 'null'],
  },

  {
    argvs: (function () {
      var deny = ['no', 'NO', 'No', 'nO']
      var len18 = [1, 0, 2, 0, 0, 3, 0, 0, 0, 1, 1, 0, 2, 2, 3, 3, 0, 3]
      var prefixs = []

      len18.forEach(function (index) {
        prefixs.push(deny[index])
      })

      return '---' + prefixs.join('-') + '-use-vim flag'
    })(),
    expected: {
      'use-vim': true
    },
    remain: ['flag'],
  },
  {
    argvs: (function () {
      var deny = ['no', 'NO', 'No', 'nO']
      var len21 = [1, 0, 2, 0, 0, 3, 0, 0, 0, 1, 1, 0, 2, 2, 3, 3, 0, 3, 0, 1, 2]
      var prefixs = []

      len21.forEach(function (index) {
        prefixs.push(deny[index])
      })

      return '---' + prefixs.join('-') + '-use-sublime flag'
    })(),
    expected: {
      'use-sublime': false
    },
    remain: ['flag'],
  },

  {
    argvs: (function () {
      var options = [
        'flag',
        '-begin',
        '--no-pause',
        '---language=javascript',
        '-no-format=true',
        '--no-build=null',
        '---no-no-comment false',
        '-combine-request=false',
        '----use-css3 false',
      ]
      return options.join(' ')
    })(),
    expected: {
      begin: true,
      pause: false,
      language: 'javascript',
      format: false,
      comment: false,
      'combine-request': false,
      'use-css3': false,
    },
    remain: ['flag', 'null'],
  },

  {
    argvs: '-t one -t 2 -t three',
    expected: {
      t: ['one', '2', 'three']
    },
    remain: [],
  },
  {
    argvs: '-t one -t null -t three -t 4 five 6 null',
    expected: {
      t: ['one', 'null', 'three', '4']
    },
    remain: ['five', '6', 'null'],
  },

  {
    argvs: '-no-t one -t 2 -no-no-t null flag',
    expected: {
      t: ['one', '2', 'null']
    },
    remain: ['flag'],
  },
  {
    argvs: '----no-t',
    expected: {
      t: ['false']
    },
    remain: [],
  },
  {
    argvs: '---no-no-t',
    expected: {
      t: ['true']
    },
    remain: [],
  },

  {
    argvs: '-aoa one -aoa null -aoa 100',
    expected: {
      aoa: ['one', null, '100']
    },
    remain: [],
  },

  {
    argvs: '--nullstream',
    expected: {
      nullstream: 'undefined'
    },
    remain: [],
  },
  {
    argvs: '--nullstream false',
    expected: {
      nullstream: null
    },
    remain: [],
  },
  {
    argvs: '--nullstream true',
    expected: {
      nullstream: 'undefined'
    },
    remain: [],
  },
  {
    argvs: '--no-nullstream',
    expected: {
      nullstream: null
    },
    remain: [],
  },

  {
    argvs: '--is-a-date=2016-01-01 flag',
    expected: {
      'is-a-date': '2016-01-01'
    },
    remain: ['flag'],
  },
  {
    argvs: '--date=2016-01-01 flag',
    expected: {
      'date': new Date('2016-01-01')
    },
    remain: ['flag'],
  }
]