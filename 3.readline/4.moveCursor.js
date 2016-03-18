var readline = require('readline')

var argv = process.argv.slice(2)
var model = null
if (argv[0]) {
  switch (argv[0]) {
    case '1':
      model = 'cursorTo'
      break
    case '2':
      model = 'moveCursor'
      break
    case '3':
      model = 'clearLineLeft'
      break
    case '4':
      model = 'clearLineRight'
      break
    case '5':
      model = 'clearLineEntire'
      break
    case '6':
      model = 'clearScreenDown'
      break
    default:
      model = null
  }
}

var rl = readline.createInterface({
  "input": process.stdin,
  "output": process.stdout
})

if (model === 'cursorTo') {
  rl.on('line', function () {
    // 绝对移动 cursorTo(stream, x, y)
    readline.cursorTo(this, 5, 0) // char:5 line:0
  })
}

if (model === 'moveCursor') {
  rl.on('line', function () {
    readline.cursorTo(this, 5, 1) // char:5 line:1
    // 相对移动 moveCursor(stream, dx, dy)
    readline.moveCursor(this, -4, 1) //char:5-4 line: 1+1
  })
}

if (model === 'clearLineLeft' || model === 'clearLineRight' || model === 'clearLineEntire') {
  /*
   * clearLine
   * -1 - Clear the left from cursor
   * 1 - Clear the right from cursor
   * 0 - Clear the entire line
   */
  var flag = (function (model) {
    if (model === 'clearLineLeft') return -1
    if (model === 'clearLineRight') return 1
    if (model === 'clearLineEntire') return 0
  })(model)

  rl.on('line', function () {
    readline.moveCursor(this, 5, -1)
    readline.clearLine(this, flag)
  })
}

if (model === 'clearScreenDown') {
  rl.on('line', function () {
    readline.moveCursor(this, 0, -1)
    readline.clearScreenDown(this)
  })
}