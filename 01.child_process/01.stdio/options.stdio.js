#!/usr/bin/env node
var fs = require('fs')
var child_process = require('child_process')
var spawn = child_process.spawn

var args = process.argv[2]
console.log('选择测试stdio的模式')

var out = fs.openSync('./log-out.log', 'a');
var err = fs.openSync('./log-err.log', 'a');

/*
 * The options.stdio option is used to configure the pipes that are established between the parent and child process.
 * By default, the child's stdin, stdout, and stderr are redirected to corresponding child.stdin, child.stdout, and child.stderr streams on the ChildProcess object.
 * This is equivalent to setting the options.stdio equal to ['pipe', 'pipe', 'pipe'].
 * */

/*
 * 'pipe' - equivalent to ['pipe', 'pipe', 'pipe'] (the default)
 * 'ignore' - equivalent to ['ignore', 'ignore', 'ignore']
 * 'inherit' - equivalent to [process.stdin, process.stdout, process.stderr] or [0,1,2]
 * */

var model = {
  1: {
    msg: 'inherit',
    stdio: 'inherit'
  },
  2: {
    msg: '[0, 1, 2]',
    stdio: [0, 1, 2]
  },
  3: {
    msg: '[process.stdin, process.stdout, process.stderr]',
    stdio: [process.stdin, process.stdout, process.stderr]
  },
  4: {
    msg: 'ignore',
    stdio: 'ignore'
  },
  5: {
    msg: "['ignore', 'ignore', 'ignore']",
    stdio: ['ignore', 'ignore', 'ignore']
  },
  6: {
    msg: 'pipe',
    stdio: 'pipe',
    grep: true
  },
  7: {
    msg: "['pipe', 'pipe', 'pipe']",
    stdio: ['pipe', 'pipe', 'pipe'],
    grep: true
  },
  8: {
    msg: "Stream Object",
    stdio: ['ignore', out, err],
    detached: true
  }
}

if (model.hasOwnProperty(args)) {
  console.log('--------------------------------------------------')
  console.log(model[args].msg)
  console.log('--------------------------------------------------')

  var option = model[args].detached ? {
    stdio: model[args].stdio,
    detached: true
  } : {
    stdio: model[args].stdio
  }

  var ps = spawn('ps', ['-a'], option)

  model[args].detached && ps.unref()

  var grep = null
  if (model[args].grep) {
    grep = spawn('grep', ['/usr/bin/sh'], {
      stdio: ['pipe', process.stdout, 2]
    })
    ps.stdout.on('data', function (data) {
      grep.stdin.write(data)
    })
  }
}