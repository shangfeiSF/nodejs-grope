var http = require('http')
var util = require('util')

var argv = process.argv.slice(2)
var code = null
if (argv[0]) {
  switch (argv[0]) {
    case 1:
      code = 'ascii'
      break
    case 2:
      code = 'hex'
      break
    default:
      code = 'utf-8'
  }
}

var server = http.createServer(function (req, res) {
  // req is an http.IncomingMessage, which is a Readable Stream
  // res is an http.ServerResponse, which is a Writable Stream
  util.log("req.readable:", req.readable)
  var body = ''
  // we want to get the data as utf8 strings
  // If you don't set an encoding, then you'll get Buffer objects
  if (code) {
    req.setEncoding(code)
  }
  // 关闭底层的文件描述符, 流上将不会再触发任何事件
  // req.destroy()
  util.log("req.pause()")
  // 暂停'data'事件的触发
  req.pause()
  setTimeout(function () {
    // 恢复被pause()调用暂停的'data'事件触发
    req.resume()
    util.log("req.resume()")
  }, 5000)
  // Readable streams emit 'data' events once a listener is added
  req.on('data', function (chunk) {
    util.log(Buffer.isBuffer(chunk))
    util.log(typeof chunk)
    util.log(chunk)
    body += chunk
  })
  // the end event tells you that you have entire body
  req.on('end', function () {
    try {
      var data = JSON.parse(body)
    } catch (er) {
      res.statusCode = 400
      return res.end('error: ' + er.message)
    }
    // write back something interesting to the user:
    res.write(typeof data)
    res.end()
  })
})
server.listen(1337)

// Useage:
// curl url -d/--data <data>   (HTTP POST方式传送数据)
// $ curl localhost:1337 -d '{}'
// object
// $ curl localhost:1337 -d '"foo"'
// string
// $ curl localhost:1337 -d 'not json'
// error: Unexpected token o