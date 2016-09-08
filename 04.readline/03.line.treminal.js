var fs = require('fs')
var readline = require('readline')

var readfile = fs.createReadStream('./log/read.log')
var writefile = fs.createWriteStream('./log/write.log', {
  flags: 'a'
})

var rl = readline.createInterface({
  "input": readfile,
  // terminal = false node处理是Tab(\t)符号时按文本处理
  // terminal = true node处理是Tab(\t)符号是按命令行模式处理，代表补全命令
  "terminal": false
})

rl.on('line', function (line) {
  writefile.write(timeStamp() + '--' + line + '\n')
})

rl.on('close', function () {
  writefile.write('------------------------------------\n')
})

function timeStamp() {
  var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
  var date = new Date()
  var timestamp = []
  stampfn.forEach(function (value) {
    timestamp.push(date[value]())
  })
  return timestamp.join(":")
}