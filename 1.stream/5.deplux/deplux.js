var fs = require('fs')
var util = require('util')

var Readable = require('stream').Readable
var Duplex = require('stream').Duplex

function Media(options) {
  if (!(this instanceof Media)) {
    return new Media(options)
  }
  Duplex.call(this, options)
}

util.inherits(Media, Duplex)

Media.prototype.timestamp = function () {
  var date = new Date()
  var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
  var timestamp = []
  stampfn.forEach(function (value) {
    timestamp.push(date[value]())
  })
  return timestamp.join(":")
}

// 当调用Media实例的write()时底层调用_write()时，_write() adds timestamp with '---'
Media.prototype._write = function (chunk, enc, callback) {
  var timestamp = this.timestamp()
  var buf = [timestamp, '---', chunk.toString('utf-8'), '\n'].join('')
  this.push(buf)

  this.emit('_writeHandle', 'Add timestamp -' + timestamp)
  callback()
}

// 当调用Media实例的read()时底层调用_read()：_read() adds random with '###'
Media.prototype._read = function (size) {
  var chunk = this.read()
  if (!chunk) return

  var random = Math.floor(Math.random() * 100)
  var buf = [random, "###", chunk.toString('utf-8')].join('')
  this.push(buf)

  this.emit('_readHandle', 'Add random #' + random)
}

var char = 97
var source = new Readable({
  encoding: 'utf8'
})
source._read = function (size) {
  var self = this
  if (char > 'z'.charCodeAt(0)) return this.push(null)
  setTimeout(function () {
    self.push(String.fromCharCode(char++))
  }, 50)
}

var media = new Media()
media.on('_writeHandle', function (msg) {
  console.log(msg)
})
media.on('_readHandle', function (msg) {
  console.log(msg)
})

var argv = process.argv.slice(2)
var model = null
if (argv[0]) {
  switch (argv[0]) {
    case '1':
      model = 'pipe_readbale'
      break
    case '2':
      model = 'pipe_data'
      break
    case '3':
      model = 'pipe_pipe'
      break
    default:
      model = null
  }
}

if (model === 'pipe_readbale' || model === 'pipe_data') {
  // fs.openSync打开一个可写流(append的方式)
  var destination = fs.openSync('destination.pipe.log', 'a')
  // pipe会调用media.write()和media._write()
  source.pipe(media)

  if (model === 'pipe_readbale') {
    // readable事件需要调用this.read()，进一步调用this._read()，获取chunk，可能是null
    media.on('readable', function () {
      // 直接调用media.read()和media._read()
      var chunk = this.read()
      console.log(chunk)
      if (!chunk) return

      fs.writeSync(destination, chunk.toString('utf-8'))
    })
  } else if (model === 'pipe_data') {
    // data事件可以直接获取chunk，没有直接调用this.read()和this._read()，chunk不会是null
    media.on('data', function (chunk) {
      console.log(chunk)
      fs.writeSync(destination, chunk.toString('utf-8'))
    })
  }

  media.on("finish", function () {
    fs.writeSync(destination, '---------------------------------\n')
    fs.closeSync(destination)
  })
}

if (model === 'pipe_pipe') {
  // fs.createWriteStream打开一个可写流(append的方式)
  var destination = fs.createWriteStream('destination.pipe_pipe.log', {
    flags: 'a'
  })
  // 与model = pipe_data效果是一样的
  // 第一个pipe会调用media.write()和media._write()
  // 第二个pipe不会调用media.read()和media._read()
  source.pipe(media).pipe(destination)

  media.on('finish', function(){
    this.push('---------------------------------\n')
  })
}