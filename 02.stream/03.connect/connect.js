var fs = require('fs')
var util = require('util')

var Readable = require('stream').Readable
var Writable = require('stream').Writable

var argv = process.argv.slice(2)
var model = null
if (argv[0]) {
  switch (argv[0]) {
    case '1':
      model = 'push_pipe'
      break
    case '2':
      model = 'read'
      break
    case '3':
      model = 'read-3'
      break
    case '4':
      model = 'read-3-0'
      break
    case '5':
      model = '_read'
      break
    case '6':
      model = 'unpipe'
      break
    case '7':
      model = 'unshift'
      break
    default:
      model = null
  }
}

if (model === 'push_pipe') {
  var read = new Readable()
  var write = fs.createWriteStream('write.push_pipe.log')

  read.setEncoding('utf8')

  read.push('push-block-1\n')
  read.push('push-block-2\n')

  read.push(util.inspect(read._readableState) + '\n')
  read.push(read._read.toString())

  // When the read ends, push the EOF-signaling null
  read.push(null)
  /*
   * 数据压入可读流前，并没有read.pipe(write)，
   * 但是压入的数据还是输出了，这是因为可读流在接收者未读取数据之前，会缓存压入的数据
   * 但是更好的方法是只有接收者请求数据时，才压入数据到可读流
   * 而不是先缓存数据，等待接收者pipe
   * 重写_read实现优化
   */
  read.pipe(write)
}

if (model === 'read' || model === 'read-3' || model === 'read-3-0') {
  // (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node connect.js 2
  // (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node connect.js 3
  // (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node connect.js 4
  process.stdin.on('readable', function () {
    var buf = model === 'read' ? process.stdin.read() : process.stdin.read(3)

    console.log(buf)
    buf && console.log(buf.toString('utf-8'))

    if (model === 'read-3-0') {
      // 额外的数据数据会留在流的内部缓冲区里，read(0)通知流来读取更多的数据
      process.stdin.read(0)
    }
  })
}

if (model === '_read') {
  var flow = new Readable()

  // _read()：you are expected to override this method in your own extension classes.
  var char = 97
  flow._read = function () {
    if (char > 'z'.charCodeAt(0)) return flow.push(null)
    setTimeout(function () {
      flow.push(String.fromCharCode(char++))
    }, 100)
  }

  flow.setEncoding('utf8')

  util.log(Buffer.isBuffer(flow))
  util.log(typeof flow)
  console.log(flow._readableState)   //flow中是没有缓存buffer的

  flow.pipe(process.stdout)
}

if (model === 'unpipe') {
  var from = new Readable()
  var to = fs.createWriteStream('write.unpipe.log')

  var data = 97
  from._read = function () {
    if (data > 'z'.charCodeAt(0)) return from.push(null)
    setTimeout(function () {
      from.push(String.fromCharCode(data++))
    }, 600)
  }

  to.on('pipe', function (source) {
    util.log(source === from)
  })

  to.on('unpipe', function (source) {
    util.log(source === from)
  })

  to.on('finish', function () {
    fs.readFile('./write.unpipe.log', function (err, data) {
      util.log('write.unpipe.log data length  is', data.length)
    })
  })

  from.setEncoding('utf-8')
  from.pipe(to)

  setTimeout(function () {
    util.log('stop writing to write.unpipe.log')
    from.unpipe(to)
    util.log('manually end write.unpipe.log')
    to.end() // emit "finish" event and excute callback
  }, 5000)
}

if (model === 'unshift') {
  var offset = 0
  var rs = fs.createReadStream('read.unshift.log')

  rs.on('readable', function () {
    var that = this
    console.log('------------------------------------------------------------------------')
    util.log('current length is', that._readableState.length)

    var buf = this.read()
    if (!buf) return

    for (; offset < buf.length; offset++) {
      // 0x0a 是换行符
      if (buf[offset] === 0x0a) {
        console.log('line content is ', buf.slice(0, offset - 1).toString())
        console.log('line charcount is ', buf.slice(0, offset - 1).toString().length)
        // 截取余下的内容
        buf = buf.slice(offset + 1)
        // offset重置，将余下的内容导回可读流
        offset = 0
        this.unshift(buf)
        return
      }
    }
  })
}

if (model === null) {
  console.log('select model')
}