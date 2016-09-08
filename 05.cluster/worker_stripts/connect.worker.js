var http = require('http')
var colors = require('colors')
var cluster = require('cluster')

function Worker() {
  this.port = process.env.port
  this.http = null
  this.args = process.argv

  this.init({
    silence: true
  })
  this.monitor('Hello master. I am worker #')
}

Worker.prototype.wait = function (mils) {
  var now = new Date
  while (new Date - now <= mils) {
  }
}

Worker.prototype.timestamp = function () {
  var date = new Date()
  var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
  var timestamp = []
  stampfn.forEach(function (value) {
    timestamp.push(date[value]())
  })
  return timestamp.join(":")
}

Worker.prototype.init = function (config) {
  var self = this
  this.http = http.createServer(function (req, res) {
    res.writeHead(200, {
      "content-type": "text/html"
    })

    var body = [
      'workerId--' + cluster.worker.id,
      'pid--' + process.pid,
      'args--' + self.args.join('#')
    ]

    res.end(body.join('<br/>'))
  }).listen(self.port, function () {
    if (!config.silence) {
      console.log(('start http server on 127.0.0.1 with port -- ' + self.port).green)
    }
  })
}

Worker.prototype.monitor = function (message) {
  var self = this
  process.on('message', function (msg) {
    var info = [
      '[worker #' + cluster.worker.id + ']',
      'receive message from master ---',
      msg.greeting,
      'at',
      msg.timestamp
    ]
    console.log((info.join(' ')).yellow)
    self.wait(2000)
    process.send({
      greeting: message + cluster.worker.id,
      period: [msg.timestamp, self.timestamp()]
    })
  })
}

Worker.start = function (isWorker) {
  isWorker && new Worker()
}

Worker.start(cluster.isWorker)