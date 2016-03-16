var child_process = require('child_process')
var spawn = child_process.spawn

var step_1 = spawn('ps', ['-a'], {
  stdio: ['ignore', 'pipe', 2]
})

var step_2 = spawn('node', ['./stdio.chain.3.other.js'], {
  stdio: ['pipe', 'pipe', 2]
})

step_1.stdout.on('data', function (data) {
  step_2.stdin.write(data)
})

step_1.on('close', function (code) {
  code !== 0 && console.log(code)
  step_2.stdin.end()
})

step_2.stdout.on('data', function (data) {
  var buf = new Buffer(data)
  console.log(buf.toString())
})