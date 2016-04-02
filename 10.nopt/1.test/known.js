var url = require('url')
var path = require('path')
var Stream = require('stream')

module.exports = {
  version: Boolean,
  loglevel: ['silent', 'win', 'error', 'warn', 'info', 'verbose', 'silly'],
  registry: url,
  color: ['inherit', Boolean],
  logfd: [Number, Stream],
  tmp: path,
  tar: String,
  t: [Array, String],
  aoa: Array,
  nullstream: [null, Stream],
  date: Date,

  usage: Boolean,
  force: Boolean,
  global: Boolean,
  long: Boolean,
  description: Boolean,
  parseable: Boolean
}