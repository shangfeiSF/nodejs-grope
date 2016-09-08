var url = require('url')
var path = require('path')
var Stream = require('stream')

module.exports = {
  version: Boolean,
  detail: ['silent', 'info', 'verbose', 'error', 'warn'],
  registry: url,
  color: ['inherit', Boolean],
  log: [Number, Stream],
  path: path,
  tar: String,
  slot: [Array, String],
  array: Array,
  nullstream: [null, Stream],
  date: Date,
  usage: Boolean,
  force: Boolean,
  global: Boolean,
}