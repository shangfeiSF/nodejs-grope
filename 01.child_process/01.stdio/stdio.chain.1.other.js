var child_process = require('child_process')
var spawn = child_process.spawn

var step_1 = spawn('ps', ['-a'], {
  stdio: ['ignore', 'pipe', 2]
})

var step_3 = spawn('grep', ['/bin/sh'], {
  // step_2 导致报错
  stdio: [step_2.stdout, 1, 2]
})

var step_2 = spawn('grep', ['/bin'], {
  stdio: [step_1.stdout, 'pipe', 2]
})

step_1.stdout.on('data', function(data){
  console.log(data)
})

step_2.stdout.on('data', function(data){
  console.log(data)
})