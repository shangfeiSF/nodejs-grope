var child_process = require('child_process')
var spawn = child_process.spawn

/*
 * 实现 ps -a | grep /bin | grep /bins/sh 的管道
 * 利用 spawn options.stdio 实现管道
 * 不采用stdio.chain.1.js的方式：显示地传递childProcss.stdout
 * 声明step_1 step_2 step_3时采用stdio: ['pipe', 'pipe', 2]配置，解绑childProcess.stdout引用，也就无需保持顺序
 * 额外的工作：data event时‘引流’, close event时‘结流’保证管道衔接下去
 */

var step_3 = spawn('grep', ['/bin/sh'], {
  stdio: ['pipe', 1, 2]
})

var step_2 = spawn('grep', ['/bin'], {
  stdio: ['pipe', 'pipe', 2]
})

var step_1 = spawn('ps', ['-a'], {
  stdio: ['ignore', 'pipe', 2]
})

step_1.stdout.on('data', function (data) {
  // 从 step_1.stdout 向 step_2.stdin ‘引流’
  step_2.stdin.write(data);
})

step_1.on('close', function (code) {
  code !== 0 && console.log(code)
  // step_1 close 时‘结流’step_2.stdin
  step_2.stdin.end()
})

step_2.stdout.on('data', function (data) {
  // 从 step_2.stdout 向 step_3.stdin ‘引流’
  step_3.stdin.write(data)
})

step_2.on('close', function (code) {
  code !== 0 && console.log(code)
  // step_2 close 时‘结流’step_3.stdin
  step_3.stdin.end()
})