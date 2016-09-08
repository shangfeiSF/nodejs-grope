var os = require('os')
var fs = require('fs')
var util = require('util')
var http = require('http')
var cluster = require('cluster')

function Master(slience) {
  this.cpus = os.cpus()
  this.requestedCount = 0
  this.workers = []

  this.init()
  this.monitor(slience)
}

Master.prototype.init = function () {
  var self = this
  var worker = null

  this.cpus.forEach(function (cpu, index) {
    var sys = cpu.times.sys
    worker = cluster.fork({
      cpu: sys,
      port: 8000 + index
    })

    worker.on('message', function (msg) {
      if (msg.validity && msg.validity === 'validable') {
        self.requestedCount++

        self.workers.forEach(function (worker) {
          if (worker.cpu == msg.cpu) {
            worker.responseCount++
          }
        })
      }
    })

    self.workers.push({
      cpu: sys,
      responseCount: 0
    })
  })
}

Master.prototype.monitor = function (slience) {
  var self = this
  if (!slience) {
    setInterval(function () {
      var requests = []
      self.workers.forEach(function (worker) {
        requests.push([worker.cpu, worker.responseCount].join('#'))
      })
      console.log(requests.join(','), " --- RequestedCount = ", self.requestedCount)
    }, 1000)
  }
}

Master.start = function (isMaster, slience) {
  if (isMaster) {
    new Master(slience)
  } else {
    new Worker()
  }
}

function Worker() {
  this.cpu = process.env.cpu
  this.http = null
  this.port = process.env.port
  this.init()
}

Worker.prototype.init = function () {
  var self = this
  this.http = http.Server(function (req, res) {

    res.writeHead(200)
    res.end(self.cpu)

    process.send({
      cpu: self.cpu,
      validity: 'validable'
    })

  }).listen(self.port, function () {
    console.log('start http server on 127.0.0.1 with port -- ' + self.port)
  })

}

Master.start(cluster.isMaster, false)