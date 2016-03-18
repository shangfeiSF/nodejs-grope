#!/usr/bin/env node
var fs = require('fs')
var child_process = require('child_process')
var exec = child_process.exec

var log = fs.openSync('./cat.1.log', 'a')

var cat = exec('cat *.js | wc -wl', {
  cwd: './'
}, function (error, stdout, stderr) {
  if (error !== null) {
    console.log('error' + error)
  }
  fs.writeFileSync(log, stdout)
})
