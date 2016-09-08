#!/usr/bin/env node

var fs = require("fs")
var nopt = require("nopt")

function Option(list) {
  this.knownOptions = require('./01.demo/known')

  this.shortOptions = require('./01.demo/short')
  /*
   * nopt(known, short, args, sliceOffset)四个参数都是可选的：
   * known 默认是{}
   * short 默认是{}
   * args 默认是process.argv
   * sliceOffset 默认是2
   */
  this.listParser = nopt(this.knownOptions, this.shortOptions, list, 0)

  var listLog = fs.openSync('./01.demo/log/list.json', 'w')
  fs.writeSync(listLog, JSON.stringify(this.listParser, null, 2))
  fs.close(listLog)

  this.processParser = nopt(this.knownOptions, this.shortOptions, process.argv, 2)

  var processLog = fs.openSync('./01.demo/log/process.json', 'w')
  fs.writeSync(processLog, JSON.stringify(this.processParser, null, 2))
  fs.close(processLog)
}

new Option([
  '-module=nopt', // 终端可以使用'='赋值
  '--yes', // 选项的前缀'-'数量（>=1）
  '---s200',
  '----yesterday',
  '--array3',
  '--item', '4',  // 终端也可以使用空格赋值
  '--cwd',
  '--github',
  //'--l',
  '--dinosaurs',
  '--env-dev',
  '--mix-1', null,  // mix-1字段不存在 ~~ Failed: 列表中是 'null' 而不是 null
  '--mix-2', null,  // null ~~ Success: 列表中的确是 null
  '--mix-3', null,  // 0 ~~ Half-Success，Number(null) = 0，强制转换（列表中 Numebr 位置更靠前）
  '--mix-4', null,  // 'null' ~~ Half-Success，String(null) = 'null'，强制转换（列表中 String 位置更靠前）
  '--mix-5', null,  // null ~~ Success，列表中 null 位置更靠前
  '--mix-6', null,  // null ~~ Success: 列表中的确有 null
  '--mix-7', null,  // null ~~ Success: 列表中的确有 null
  '--isnull=null',  // null
  '--debug',  // true
  '--no-wrap',  // false
  '--price=100.10' // '100.10'
])
/*
 * 脚本中配置的list可以输入更多的数据类型，如null
 * 按照顺序检索，遇到类型时发生强制转换，严格区分对象null 和字符串'null'
 * 终端输入的list只能是字符串（short中配置的参数也是只能是字符串）
 * 首先按照对象null顺序检索，遇到类型时发生强制转换，失败的话再按照字符串'null'顺序检索
 */

// 方式1：使用脚本中提供的字符串 'null'
// 01.demo.js --no --no-website --env-dail --mix-1-null --mix-2-null --mix-3-null --mix-4-null --mix-5-null --mix-6-null --mix-7-null
// 方式2：使用来自终端输入的字符串 null
// 01.demo.js --no --no-website --env-dail --mix-1 null --mix-2 null --mix-3 null --mix-4 null --mix-5 null --mix-6 null --mix-7 null
// 方式1 与 方式2 在 01.demo.process.json 中输出一致