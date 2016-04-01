#!/usr/bin/env node

var fs = require("fs")
var url = require("url")
var path = require("path")
var Stream = require("stream")
var nopt = require("../lib/nopt")

function Commander(config) {
  this.commanderArgs = {
    known: config.known,
    short: config.short,
    list: config.list,
    offset: 0
  }

  this.processArgs = {
    known: config.known,
    short: config.short,
    list: process.argv,
    offset: 2
  }

  /*
   * nopt(known, short, args, sliceOffset)四个参数都是可选的：
   * known 默认是{}
   * short 默认是{}
   * args 默认是process.argv
   * sliceOffset 默认是2
   */
  console.log(this.processArgs.list)
  // this.argsParser = nopt(this.commanderArgs.known, this.commanderArgs.short, this.commanderArgs.list, this.commanderArgs.offset)
  this.processArgsParser = nopt(this.processArgs.known, this.processArgs.short, this.processArgs.list, this.processArgs.offset)

  this.log = function () {
    // console.log(this.argsParser)
    console.log(this.processArgsParser)
  }

  this.log()
}

new Commander({
  known: {
    'string': [String],
    'boolean': Boolean,
    'number': Number,
    'date': Date,
    'array': Array,
    'path': path,
    'url': url,
    'stream': Stream,
    'NaN': NaN,
    'enumerable': ['develop', 'prepare', 'product'],
    'mix': [null, Number, 'mix-nodejs']
  },
  short: {
    // short 中的参数必须是字符串
    'str': '--string',
    'bt': ['--boolean', 'true'],
    'bf': ['--boolean', 'false'],
    'n200': ['--number', '200'],
    'now': ['--date', (new Date()).toJSON()],
    'array3': ['--array', '1', '--array', '2', '--array', '3'],
    'dir': ['--path', '../'],
    'github': ['--url', 'https://github.com'],
    // 'log': ['--stream', fs.createReadStream('my-program.js')],
    'try': ['--NaN', 'try to be allowed!'],
    'endev': ['--enumerable', 'develop'],
    'en200': ['--enumerable', '200'],
    'enture': ['--enumerable', 'false'],
    'mixnull': ['mix', 'null']
  },
  list: [
    '--str', 'string-nodejs',
    '--bt',
    '--bf',
    '--n200',
    '--now',
    '--array3',
    '--dir',
    '--github',
    //'--log',
    '--try',
    '--endev',
    '--mix', null,
    '--isnull=null',
    '--debug',
    '--no-wrap'
  ]
})