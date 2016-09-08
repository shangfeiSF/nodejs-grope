/*
 * tick: 1
 * tick: 2
 * tick: 7
 * tick: 10
 * immediate : 3
 * immediate : 4
 * immediate : 9
 * tick: 5
 * tick: 8
 */

// nextTick的插入位置是在当前帧的末尾且IO回调之前(如果nextTick过多，会导致io回调不断延后)
function nextTick(msg, callback) {
  process.nextTick(function () {
    console.log('tick: ' + msg)
    callback && callback()
  })
}

// setImmediate 的插入位置是在下一帧，不会影响io回调
function immediate(msg, callback) {
  setImmediate(function () {
    console.log('immediate : ' + msg)
    callback && callback()
  })
}

nextTick('1')

nextTick('2', function () {
  nextTick('10')
})

immediate('3', function () {
  nextTick('5')
})

nextTick('7', function () {
  immediate('9')
})

immediate('4', function () {
  nextTick('8')
})