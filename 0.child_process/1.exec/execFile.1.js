var child_process = require('child_process')
var execFile = child_process.execFile

var cat = execFile('node', ['./exec.1.js'], {
  cwd: './'
}, function (error, stdout, stderr) {
  console.log('stdout' + stdout)
  console.log('stderr' + stderr)
  if (error !== null) {
    console.log('error' + error)
  }
})
