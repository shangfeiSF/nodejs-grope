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
    argvs: '---v',
    expected: {
      version: true
    },
    remain: [],
  },
  {
    argvs: '--no-v',
    expected: {
      version: false
    },
    remain: [],
  },

  {
    argvs: 'build -s',
    expected: {
      detail: 'silent'
    },
    remain: ['build'],
  },
  {
    argvs: 'build -s connect -i',
    expected: {
      detail: 'info'
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
    argvs: 'connect --no-registry https://github.com/',
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
    argvs: 'open --log=10',
    expected: {
      log: 10
    },
    remain: ['open'],
  },
  {
    argvs: '--log xxx',
    expected: {
      log: 'undefined'
    },
    remain: [],
  },

  {
    argvs: '--path=./tmp -tar zip',
    expected: {
      path: path.resolve(process.cwd(), './tmp'),
      tar: 'zip'
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
    argvs: '-slot one -slot 2 -slot three',
    expected: {
      slot: ['one', '2', 'three']
    },
    remain: [],
  },
  {
    argvs: '-slot one -slot null -slot three -slot 4 five 6 null',
    expected: {
      slot: ['one', 'null', 'three', '4']
    },
    remain: ['five', '6', 'null'],
  },

  {
    argvs: '-no-slot one -slot 2 -no-no-slot null flag',
    expected: {
      slot: ['one', '2', 'null']
    },
    remain: ['flag'],
  },
  {
    argvs: '----no-slot',
    expected: {
      slot: ['false']
    },
    remain: [],
  },
  {
    argvs: '---no-no-slot',
    expected: {
      slot: ['true']
    },
    remain: [],
  },

  {
    argvs: '-array one -array null -array 100',
    expected: {
      array: ['one', null, '100']
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