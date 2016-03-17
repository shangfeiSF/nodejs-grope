var fs = require('fs')
var readline = require('readline')

function timeStamp(){
  var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
  var date = new Date()
  var timestamp = []
  stampfn.forEach(function(value, index, array){
    timestamp.push(date[value]())
  })
  return timestamp.join(":")
}


var rs_file_name = "./files/file-2.txt"
var rs = fs.createReadStream(rs_file_name)
var ws_file_name = "./files/file-2-change.txt"
var ws = fs.createWriteStream(ws_file_name, { flags: 'a'})

var rl = readline.createInterface({
  "input": rs,
  // 注意 terminal: false 这个参数很重要
  // 如果不指定false, node会认为输入来自TTY(Teletype), 即终端设备(命令行模式), 这种情况下，Tab(\t)符号代表“自动补全”
  // 结果就是：接收到的line值, 所有的Tab号都消失了！
  "terminal": false
});

rl.on('line', function(line){
  ws.write(timeStamp() + "--" + line.slice(0, 20) + "\n")
});