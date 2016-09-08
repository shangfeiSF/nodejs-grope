var fs = require('fs')
var util = require('util')
var Transform = require('stream').Transform
var Writable = require('stream').Writable

util.inherits(Liner, Transform)

function Liner(options) {
  if (!(this instanceof Liner)) {
    return new Liner(options)
  }
  this.cache = []
  Transform.call(this, options)
}

Liner.prototype.timestamp = function () {
  var date = new Date()
  var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
  var timestamp = []
  stampfn.forEach(function (value) {
    timestamp.push(date[value]())
  })
  return timestamp.join(":")
}

Liner.prototype._transform = function (chunk, encoding, done) {
  if (!chunk) return

  var begin = null
  // windows 换行字符'\r\n'，换行Buffer 0x0d 0x0a
  for (var offset = 0; offset < chunk.length; offset++) {
    if (begin === null && chunk[offset] !== 0x0a) {
      begin = offset
    } else if (chunk[offset] === 0x0a || offset === chunk.length - 1) {
      var lineBuffer = chunk.slice(begin, offset)
      console.log('-----------------------------------')
      console.log('\tBuffer:', lineBuffer)

      if (lineBuffer[0] !== 0x0d && lineBuffer[1] !== 0x0a) {
        console.log('\tString:', lineBuffer.toString('utf-8'))

        var timestamp = this.timestamp()
        this.cache.push(lineBuffer.toString('utf-8').slice(1, 2))
        this.push(timestamp + "---" + lineBuffer.toString('utf-8'))
        this.emit("timestamp", "add timestamp at " + timestamp)
      }

      chunk = chunk.slice(offset)
      begin = null
      offset = 0
    }
  }
  done()
}

// _flush 是end之前调用的方法
Liner.prototype._flush = function (done) {
  if (this.cache) this.push(this.cache.join('--'))
  this.cache = null
  done()
}

var argv = process.argv.slice(2)
var model = null
if (argv[0]) {
  switch (argv[0]) {
    case '1':
      model = '_transform'
      break
    case '2':
      model = 'pipe'
      break
    case '3':
      model = 'unpipe'
      break
    default:
      model = null
  }
}

if (model === '_transform') {
  var read = fs.createReadStream('read.log')
  var write = fs.createWriteStream('write.log')

  var liner = new Liner()
  read.pipe(liner).pipe(write)
  liner.on("timestamp", function (data) {
    console.log('\tInfo:', data)
  })
  liner.on("error", function (e) {
    console.log(e)
  })
}

if (model === 'pipe' || model === 'unpipe') {
  var source = fs.createReadStream('source.txt')
  var destination = fs.openSync('destination.txt', 'a')

  var media = new Writable()

  if (model === 'pipe') {
    source.pipe(media)
  }

  source.on("readable", function () {
    var buf = this.read()
    console.log('------------------------')
    console.log(buf)
    if (!buf) return

    for (var offset = 0; offset < buf.length; offset++) {
      if (buf[offset] === 0x0a || offset == buf.length - 1) {

        this.emit("sourceTransform", timestamp() + " --- transform when source on readable")

        media.write(timestamp() + "---" + buf.slice(0, offset + 1).toString('utf-8'))

        buf = buf.slice(offset + 1)
        this.unshift(buf)
        return
      }
    }
  })

  /*
   * _write会在media写入数据是调用：
   * 1. source.pipe(media)：全部的source内容
   * 2.  media.write：加上时间戳的每一行内容
   */
  media._write = function (chunk, enc, callback) {
    var temp = Math.round(Math.random() * 100) + "---" + chunk.toString('utf-8')

    this.emit("mediaTransform", timestamp() + " --- transform when media.write")
    fs.writeSync(destination, temp)

    callback()
  }

  source.on("sourceTransform", function (data) {
    console.log(data)
  })
  media.on("mediaTransform", function (data) {
    console.log(data)
  })
  media.on("finish", function () {
    fs.closeSync(destination)
  })

  var timestamp = function () {
    var date = new Date()
    var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
    var timestamp = []
    stampfn.forEach(function (value) {
      timestamp.push(date[value]())
    })
    return timestamp.join(":")
  }
}