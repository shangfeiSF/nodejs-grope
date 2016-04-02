var url = require("url")
var path = require("path")
var Stream = require("stream")

module.exports = {
  'name': [String],
  'answer': Boolean,
  'status': Number,
  'time': Date,
  'item': Array,
  'path': path,
  'website': url,
  // 'log': Stream,
  'deprecated': NaN,
  'environment': ['develop', 'product'],
  //测试对象 null 和字符串 'null'
  'mix-1': ['node', 'null'],
  'mix-2': ['node', null],
  'mix-3': [Number, 'node', null],
  'mix-4': [String, 'node', null],
  'mix-5': [null, String, 'node'],
  'mix-6': ['null', null, String, 'node'],
  'mix-7': [null, 'null', String, 'node']
}