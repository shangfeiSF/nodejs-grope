var http = require('http')

function Server(option) {
  var option = option || {}

  this.computeCountLimit = option.computeCountLimit || null
  this.lasting = option.computeCountLimit ? false : true
  this.computeCurrentCount = 0

  this.network = null
  this.start(option.port || 5000)

  console.log('start computing')
  this.startCompute = process.hrtime()
  this.immediate = option.immediate || true
  this.cost = option.cost || 1000
  this.compute()
}

Server.prototype.wait = function (mils) {
  var now = new Date
  while (new Date - now <= mils) {
  }
}

Server.prototype.compute = function () {
  var self = this

  var begin = process.hrtime()
  this.wait(1000)
  var duration = process.hrtime(begin)
  var seconds = duration[0] + duration[1] * 1e-9
  console.log('compute cost about ' + seconds + 'S at #' + this.computeCurrentCount)
  this.computeCurrentCount++

  if (this.lasting || this.computeCurrentCount < this.computeCountLimit) {
    if (self.immediate) {
      setImmediate(function () {
        self.compute()
      })
    } else {
      process.nextTick(this.compute.bind(this))
    }
  } else {
    var diff = process.hrtime(this.startCompute)
    this.computeCurrentCount = 0
    console.log('-------------------------------------------------------------------------')
    console.log('compute has completed and took ( %d) seconds and (%d) nanoseconds', diff[0], diff[1])
  }
}

Server.prototype.start = function (port) {
  var self = this
  this.network = http.createServer(function (req, res) {
    console.log('---Request for http server---')

    res.writeHead(200, {'Content-Type': 'text/plain'})

    res.end('Computed ' + self.computeCurrentCount)

  }).listen(port, '127.0.0.1')
}

var argv = process.argv.slice(2)
var immediate = argv[0] ? true : false
console.log('Immediate---', immediate)

var server = new Server({
  immediate: immediate,
  port: 8080,
  cost: 1000
})

//process.maxTickDepth = 5

// stdout: 1 4 2 3 or 1 4 3 2
// setTimeout(callback,0)会将事件放到下一个事件循环中，会比nextTick慢执行，但是和setImmediate到底哪个快是不确定的
/*
 console.log('1');
 setImmediate(function () {
 console.log('2');
 });
 setTimeout(function () {
 console.log('3');
 },0);
 process.nextTick(function () {
 console.log('4');
 })
 */

// nextTick的插入位置是在当前帧的末尾且IO回调之前(如果nextTick过多，会导致io回调不断延后)
// setImmediate 的插入位置是在下一帧，不会影响io回调
/*
 这段代码的输出是:
 tick: 1
 tick: 2
 tick: 7
 tick: 10
 immediate : 3
 tick: 5
 immediate : 4
 tick: 8
 immediate : 9

 解释如下:
 1). 第一遍执行时, 会分别向nextTick队列和immedidate队列中加入方法,它们变成:
 nextTick:    1  2  7  (数字代表输出相应数字的那个nextTick方法对应的callback方法,下同)
 immedidate:  3  4
 2). 到了nextTick, 开始执行回调
 先执行 nextTick 队列中的回调(全部执行才结束):
 2.1) 执行1   -- 输出1, nextTick队列变为 2  7
 2.2) 执行2   -- 输出2, 并向nextTick队列添加10, nextTick队列变为 7  10
 2.3) 执行7   -- 输出7, 并向immediate队列添加9.  nextTick 队列变为 10  immediate队列变为 3  4  9
 2.4) nextTick队列中还有一个新添加的10, 故执行它, 输出10

 再执行immediate队列的第一个回调方法(immediate队列为 3 4 9)
 即执行3, 输出3同时向nextTick队列中加入5.
 5不会在这个tick执行, 因为本轮nextTick的执行已经结束了.
 此时, 队列变为:
 nextTick:  5
 immedidate:  4 9
 这也是进入下一轮tick前的队列状态.
 3). 到了nextTick, 开始执行回调
 队列为:
 nextTick:  5
 immedidate:  4 9
 和上一轮类似:
 3.1) 执行 nextTick 5, 输出 5. nextTick为空, 执行完毕.

 执行immediate队列的第一个回调, 即4, 输出4, 并向nextTick队列加入8. 此时队列变化为:
 nextTick: 8
 immediate: 9
 4). 到了nextTick, 开始执行回调
 将分别执行 nextTick 8 和 immediate 9 , 将输出8和输出9.
 */
/*
 function nextTick(msg, cb) {
 process.nextTick(function() {
 console.log('tick: ' + msg);
 if (cb) {
 cb();
 }
 });
 }
 function immediate(msg, cb) {
 setImmediate(function() {
 console.log('immediate : ' + msg);
 if (cb) {
 cb();
 }
 });
 }
 nextTick('1');
 nextTick('2', function() {
 nextTick('10');
 });

 immediate('3', function() {
 nextTick('5');
 });

 nextTick('7', function() {
 immediate('9');
 });

 immediate('4', function() {
 nextTick('8');
 });
 */
