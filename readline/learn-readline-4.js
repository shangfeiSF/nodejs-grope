function timeStamp(){
  var date = new Date()
  var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
  var timestamp = []
  stampfn.forEach(function(value, index, array){
    timestamp.push(date[value]())
  })
  return timestamp.join(":")
}
var readline = require('readline');

var rl = readline.createInterface({
  "input": process.stdin,
  "output": process.stdout
})
/*
  rl.on('line', function () {
    // 绝对移动
    readline.cursorTo(rl, 5, 0)
    // Clears current line of given TTY stream in a specified direction. dir should have one of following values:
    // -1 - to the left from cursor
    //  1 - to the right from cursor
    //  0 - the entire line
    //右清除
    readline.clearLine(rl, 1)
  })
*/
/*
  rl.on('line', function () {
    // 相对移动
    readline.moveCursor(rl, 5, -1)
    // 左清除
    readline.clearLine(rl, -1)
  })
*/
/*
  rl.on('line', function () {
    // 相对移动
    readline.moveCursor(rl, 5, -1)
    // 行清除
    readline.clearLine(rl, 0)
  })
*/
/*
  rl.on('line', function () {
    readline.moveCursor(this, 0, -1)
    readline.clearScreenDown(this)
  });
*/

