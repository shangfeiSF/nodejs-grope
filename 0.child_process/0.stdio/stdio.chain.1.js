var child_process = require('child_process')
var spawn = child_process.spawn

/*
 * 实现 ps -a | grep /bin | grep /bins/sh 的管道
 * 利用 spawn options.stdio 实现管道
 * 注意：step_1 step_2 监听的 data event
 * 注意：step_3 需要引用step_2，step_2 需要引用 step_1
 * 即便JS有提升变量声明的机制，但是这样实现管道，也一定要保证被引用的childProcess先声明
 * stdio.chain.1.other.js 中更换了step_1 step_2 step_3 的顺序，就会报错
 */

var step_1 = spawn('ps', ['-a'], {
  stdio: ['ignore', 'pipe', 2]
})

/* step_1.stdout 上的监听器会失效 */
step_1.stdout.on('data', function(data){
  console.log(data)
})

/* step_1.stdout 作为 step_2.stdin，即step_1的输出作为step_2的输入*/
var step_2 = spawn('grep', ['/bin'], {
  stdio: [step_1.stdout, 'pipe', 2]
})

/* step_2.stdout 上的监听器会失效 */
step_2.stdout.on('data', function(data){
  console.log(data)
})

/*  step_2.stdout 作为 step_3.stdin，即step_2的输出作为step_3的输入 */
 var step_3 = spawn('grep', ['/bin/sh'], {
  stdio: [step_2.stdout, 1, 2]
})