var fs = require('fs')
var util = require('util')
var readline = require('readline')

// 异步completer实现
function completer(line, callback) {
  var completions = '.html .css .js .json .htm .sqlit'.split(' ')
  var hits = completions.filter(function (word) {
    return word.indexOf(line) == 0
  })
  callback(null, [hits.length ? hits : completions, line])
  console.log('\nmessage consoled after completer')
}

var rl = readline.createInterface({
  "input": process.stdin,
  "output": process.stdout,
  "completer": completer
})
rl.question("input and then tab: ", function (answer) {
  console.log("completer handle：", answer)
  rl.close()
})