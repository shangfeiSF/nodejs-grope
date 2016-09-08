var child_process = require('child_process')
var spawn = child_process.spawn

var step_a = spawn('grep', ['/bin'], {
  stdio: [0, 'pipe', 2]
})

var step_b = spawn('grep', ['/bin/sh'], {
  stdio: ['pipe', 1, 2]
})

step_a.stdout.on('data', function (data) {
  step_b.stdin.write(data)
})

step_a.on('close', function (code) {
  code !== 0 && console.log(code)
  step_b.stdin.end()
})