var fs = require('fs')
var util = require("util")

var argv = process.argv.slice(2)
var model = null
if (argv[0]) {
  switch (argv[0]) {
    case '1':
      model = 'pipe'
      break
    case '2':
      model = 'end-true'
      break
    case '3':
      model = 'end-false'
      break
    case '4':
      model = 'setEncoding'
      break
    default:
      model = null
  }
}

if (model === 'pipe') {
  console.log('pipe')
  console.log('------------------------------')
  /*
   * Nodejs Stream 兼容性
   * As a Stream, process.stdin can also be used in "old" mode that is compatible with scripts written for node.js prior to v0.10.
   * For more information see Stream compatibility. see /node-v5.6.0/doc/api/stream.html#stream_compatibility_with_older_node_js_versions
   * In "old" Streams mode the stdin stream is paused by default, so one must call process.stdin.resume() to read from it.
   * Note also that calling process.stdin.resume() itself would switch stream to "old" mode.
   */
  process.stdin.pipe(process.stdout)
}

if (model === 'end-true' || model === 'end-false') {
  console.log('end')
  console.log('------------------------------')
  /*
   * stream.pipe(destination, [options])
   * options.end [Boolean]：By Default is true, end the writer when the reader ends
   * Note that process.stderr and process.stdout are never closed until the process exits, regardless of the specified options.
   */
  var read = fs.createReadStream('read.log')
  var write = fs.createWriteStream('write.log')

  read.pipe(write, {
    end: model === 'end-true'
  })

  read.on('end', function () {
    try {
      write.end('\nThis content is append after read.log end')
    } catch (e) {
      console.log(e)
    }
  })
}

if (model === 'setEncoding' || model == null) {
  console.log('setEncoding')
  console.log('------------------------------')

  /*
   * model = null
   * 输入aaa 输出<Buffer 61 61 61 0d 0a>
   * a的内码(ascii)是97, 换成16进制是61
   * 换行/新行(LF)的内码是10, 换成16进制是0a
   * 回车(CR)的内码是13, 换成16进制是0d
   *
   * model = 'setEncoding'
   * 输入aaa
   * 输出'aaa\r\n'
   * 换行/新行(LF)的转义符是\r
   * 回车(CR)的转义符是\n
   */
  model && process.stdin.setEncoding('utf8')

  process.stdin.on('readable', function () {
    var chunk

    process.stdin.pause()

    while (null !== (chunk = process.stdin.read())) {
      util.log("isBuffer - " + Buffer.isBuffer(chunk))
      util.log("typeof - " + typeof chunk)

      console.log(util.inspect(chunk, true, 3))
      console.log('got %d bytes of process.stdin', chunk.length)
    }
  })
}