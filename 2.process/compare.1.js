// 1 4 3 2
console.log('1')

setImmediate(function () {
  console.log('2')
})

process.nextTick(function () {
  console.log('4')
})

setTimeout(function () {
  console.log('3')
}, 0)