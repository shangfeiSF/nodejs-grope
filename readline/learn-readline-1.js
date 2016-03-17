var fs = require('fs')
// var write_file_name = "callback-of-completer.js"
// var fd = fs.openSync(write_file_name, 'w')

var readline = require('readline')
var events = require('events')
var util = require('util')
util.inherits(readline.createInterface, events.EventEmitter)

// readline阻塞命令行的自动补全
function auto_completer(line) {
  var completions = 'html css js json xml htm sqlit txt db java cpp dll'.split(' ')
  var patter = /.\./
  if(line.search(patter) > -1){
    var point = line.lastIndexOf(".")
    // find the last"."
    if(point < line.length){
      var unfinish = []
      var possible = []
      // 记录未完成ss的部分
      for(var l = point + 1; l < line.length; l ++){
        unfinish.push(line.charAt(l))
      }
      // 逐个字符检查completions于unfinish匹配的item, 录入到possible
      completions.forEach(function (item, index, array){
        var check = unfinish.every(function (char, pos, arr){
          return item.charAt(pos) === char
        })
        if(check){
          possible.push(item)
        }
      })
    }
    // possible排序
    possible.sort(function (c1, c2){
      return c1.length - c2.length
    })
    var new_possible = possible.map(function (item, index, array){
      return (line.slice(0, point) + "." + item)
    })
    // The completer function is given the current line entered by the user, and is supposed to return an Array with 2 entries:
    // 1. An Array with matching entries for the completion.
    // 2. The substring that was used for the matching.
    // Which ends up looking something like: [ [substr1, substr2, ...], originalsubstring ].
    return [new_possible.length ? new_possible : completions, line]
  }
}

// readline实现非阻塞命令行的自动补全
function async_auto_completer(line, callback) {
  // 导出异步下completer的callback:
    // fs.writeSync(fd, callback.toString())
    // fs.closeSync(fd)
  // 供补全的文件类型:
  var completions = 'html css js json xml htm sqlit txt db java cpp dll'.split(' ')
  var patter = /.\./
  if(line.search(patter) > -1){
    var point = line.lastIndexOf(".")
    // find the last"."
    if(point < line.length){
      var unfinish = []
      var possible = []
      // 记录未完成的部分
      for(var l = point + 1; l < line.length; l ++){
        unfinish.push(line.charAt(l))
      }
      // 逐个字符检查completions于unfinish匹配的item, 录入到possible
      completions.forEach(function (item, index, array){
        var check = unfinish.every(function (char, pos, arr){
          return item.charAt(pos) === char
        })
        if(check){
          possible.push(item)
        }
      })
    }
    // possible排序
    possible.sort(function (c1, c2){
      return c1.length - c2.length
    })
    // 将possible前置输入部分"."之间的部分
    var new_possible = possible.map(function (item, index, array){
      return (line.slice(0, point) + "." + item)
    })
    // 调用callback实现自动补全, 或者possible列表提示
    callback(null, [new_possible, line])
  }
}

// Useage:
var rl = readline.createInterface({
  "input": process.stdin,
  "output": process.stdout,
  // "completer": auto_completer
  "completer": async_auto_completer
});
rl.question("Please input ths file name: ", function(answer) {
  // TODO: Log the answer in a database
  console.log("The filename is", answer);
  rl.close();
})
// rl.on("before", function (mes){
//   console.log("\n" + mes)
// })
// rl.on("after", function (mes){
//   console.log("\n" + mes)
// })