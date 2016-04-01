#!/usr/bin/env node

var fs = require("fs")
var url = require("url")
var path = require("path")
var Stream = require("stream")
var nopt = require("nopt")

function Option(list) {
  this.knownOptions = {
    'string': [String],
    'boolean': Boolean,
    'number': Number,
    'date': Date,
    'array': Array,
    'path': path,
    'url': url,
    // 'stream': Stream,
    'NaN': NaN,
    'env': ['develop', 'product'],
    'mix-1': ['node', 'null'],
    'mix-2': ['node', null],
    'mix-3': [Number, 'node', null],
    'mix-4': [String, 'node', null],
    'mix-5': [null, String, 'node'],
    'mix-6': ['null', null, String, 'node'],
    'mix-7': [null, 'null', String, 'node']
  }

  this.shortOptions = {
    // short 中的配置参数必须是字符串，否则会报错
    'str': '--string',
    'yes': ['--boolean', 'true'],
    'no': ['--boolean', 'false'],
    'n200': ['--number', '200'],
    'now': ['--date', (new Date()).toJSON()],
    'array3': ['--array', '1', '--array', '2', '--array', '3'],
    'cwd': ['--path', './'],
    'github': ['--url', 'https://github.com'],
    // 'log': ['--stream'],
    'backdoor': ['--NaN', 'try to use backdoor?'],
    'env-dev': ['--env', 'develop'],
    'env-dail': ['--env', 'daily'],
    'mix-1-null': ['--mix-1', 'null'],
    'mix-2-null': ['--mix-2', 'null'],
    'mix-3-null': ['--mix-3', 'null'],
    'mix-4-null': ['--mix-4', 'null'],
    'mix-5-null': ['--mix-5', 'null'],
    'mix-6-null': ['--mix-6', 'null'],
    'mix-7-null': ['--mix-7', 'null']
  }
  /*
   * nopt(known, short, args, sliceOffset)四个参数都是可选的：
   * known 默认是{}
   * short 默认是{}
   * args 默认是process.argv
   * sliceOffset 默认是2
   */
  this.listParser = nopt(this.knownOptions, this.shortOptions, list, 0)

  var listLog = fs.openSync('./0.demo.list.json', 'w')
  fs.writeSync(listLog, JSON.stringify(this.listParser, null, 2))
  fs.close(listLog)

  this.processParser = nopt(this.knownOptions, this.shortOptions, process.argv, 2)

  var processLog = fs.openSync('./0.demo.process.json', 'w')
  fs.writeSync(processLog, JSON.stringify(this.processParser, null, 2))
  fs.close(processLog)
}

new Option([
  '--str', 'nopt',
  '--yes',
  '--n200',
  '--now',
  '--array3',
  '--cwd',
  '--github',
  //'--log',
  '--backdoor',
  '--env-dev',
  '--mix-1', null,  // mix-1 配置失败: 列表中是 'null' 而不是 null
  '--mix-2', null,  // null  配置成功: 列表中的确是 null
  '--mix-3', null,  // 0 配置虽然成功，强制转换（列表中 Numebr 位置更靠前）Number(null) = 0
  '--mix-4', null,  // 'null' 配置虽然成功，强制转换（列表中 String 位置更靠前）String(null) = 'null'
  '--mix-5', null,  // null 配置成功，列表中 null 位置更靠前
  '--mix-6', null,  // null  配置成功: 列表中的确有 null
  '--mix-7', null,  // null  配置成功: 列表中的确有 null
  '--isnull=null',  // null
  '--debug',  // true
  '--no-wrap'  // false
])
/*
 * 脚本中配置的list可以输入更多的数据类型，如null
 * 按照顺序呢检索，遇到类型时发生强制转换，严格区分对象null 和字符串'null'
 * 终端输入的list只能是字符串（short中配置的参数也是只能是字符串）
 * 首先按照对象null顺序检索，遇到类型时发生强制转换，失败的话再按照字符串'null'顺序检索
 */

// 方式1：使用脚本中提供的字符串 'null'
// 0.demo.js --no --env-dail --mix-1-null --mix-2-null --mix-3-null --mix-4-null --mix-5-null --mix-6-null --mix-7-null
// 方式2：使用来自终端输入的字符串 null
// 0.demo.js --no --env-dail --mix-1 null --mix-2 null --mix-3 null --mix-4 null --mix-5 null --mix-6 null --mix-7 null
// 方式1 与 方式2 在 0.demo.process.json 中输出一致