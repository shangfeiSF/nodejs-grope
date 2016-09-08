var os = require('os')
var http = require('http')
var colors = require('colors')
var cluster = require('cluster')

function Master(port) {
  this.cpus = os.cpus()
  this.census = {}
  this.option = {
    hostname: 'localhost',
    port: port || 8000,
    path: '/',
    agent: false
  }
  this.prefix = 'process#'
  this.onlined = 0

  this.init()

  this.masetr_monitor()
  this.worker_monitor()

  this.online()
}

Master.prototype.init = function () {
  console.log('[master] process start up...')
  this.cpus.forEach(function () {
    cluster.fork()
  })
}

Master.prototype.masetr_monitor = function () {
  var self = this

  cluster.on('listening', function (worker, address) {
    var pop = [self.prefix, worker.process.pid].join('')
    self.census[pop] = 0
    console.log('[worker #' + worker.id + '] process id: ' + worker.process.pid)
  })

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker: ' + worker.process.pid + ' died')
  })
}

Master.prototype.worker_monitor = function () {
  var self = this
  Object.keys(cluster.workers).forEach(function (id) {
    cluster.workers[id].on('message', function (pid) {
      var pop = [self.prefix, pid].join('')
      self.census[pop] += 1
    })
  })
}

Master.prototype.online = function () {
  var self = this
  cluster.on('online', function (worker) {
    self.onlined += 1

    if (self.onlined != self.cpus.length) return

    setTimeout(function () {
      console.log('requesting...')
      self.touch(10000)
    }, 2000)

  })
}

Master.prototype.touch = function (total) {
  var self = this
  var current = 0

  for (var i = 0; i < total; i++) {
    (function (option) {
      http.get(option, function (res) {
        current += 1
        if (current != total) return

        self.report()

      }).on('error', function (e) {
        console.log('error: ', e)
      })
    })(self.option)
  }
}

Master.prototype.report = function () {
  var self = this

  console.log('req end')
  console.log('waiting for result...')

  setTimeout(function () {
    console.log(self.census)
    cluster.disconnect(function () {
      process.exit(0)
    })
  }, 2500)
}

Master.start = function (isMaster) {
  if (isMaster) {
    new Master(8000)
  } else {
    new Worker(8000)
  }
}

function Worker(port) {
  this.port = port || 8000
  this.http = null

  this.init()
}

Worker.prototype.init = function () {
  var self = this
  this.http = http.createServer(function (req, res) {
    process.send(process.pid)
    res.end()
  }).listen(self.port, function () {
    console.log('http server on 127.0.0.1:' + self.port + ' in [worker #' + cluster.worker.id + ']')
  })
}

Master.start(cluster.isMaster)