var os = require('os')
var http = require('http')
var path = require('path')
var colors = require('colors')
var cluster = require('cluster')

function Master(stript) {
  this.workerIds = []
  this.dir = './worker_stripts'
  this.stript = stript || 'connect.worker.js'

  this.init({
    baseport: 8000,
    message: 'Fork worker #',
    silence: true
  })
  this.master_monitor(true)
  this.worker_monitor()
  this.post_interval({
    interval: 4000,
    message: 'Hello worker #'
  })
}

Master.prototype.timestamp = function () {
  var date = new Date()
  var stampfn = ["getHours", "getMinutes", "getSeconds", "getMilliseconds"]
  var timestamp = []
  stampfn.forEach(function (value) {
    timestamp.push(date[value]())
  })
  return timestamp.join(":")
}

Master.prototype.init = function (config) {
  var execValue = path.join(this.dir, this.stript)
  var argsValue = ['first args', 'second args']
  cluster.setupMaster({
    exec: execValue,
    args: argsValue
  })

  if (!config.silence) {
    console.log('--------------------------------------------------------------'.green)
    console.log('exec ---', cluster.settings.exec)
    console.log('args ---', cluster.settings.args)
    console.log('silent ---', cluster.settings.silent)
    console.log('--------------------------------------------------------------'.green)
  }

  for (var i = 0; i < os.cpus().length; i++) {
    var worker = cluster.fork({
      port: config.baseport + i
    })
    worker.send({
      greeting: config.message + worker.id,
      timestamp: this.timestamp()
    })
  }
}

Master.prototype.master_monitor = function (silence) {
  cluster.on('fork', function (worker) {
    !silence && console.log(('[master] ' + 'fork: worker' + worker.id).green)
  })

  cluster.on('online', function (worker) {
    !silence && console.log(('[master] ' + 'online: worker' + worker.id).green)
  })

  cluster.on('listening', function (worker, address) {
    !silence && console.log(('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port).green)
  })

  cluster.on('disconnect', function (worker) {
    !silence && console.log(('[master] ' + 'disconnect: worker' + worker.id).green)
  })

  cluster.on('exit', function (worker, code, signal) {
    !silence && console.log(('[master] ' + 'exit worker' + worker.id + ' died').green)
  })
}

Master.prototype.worker_monitor = function () {
  for (var id in cluster.workers) {
    this.workerIds.push(id)
  }

  this.workerIds.forEach(function (id) {
    cluster.workers[id].on('message', function (msg) {
      var info = [
        '[master] receive message from worker #' + this.id,
        '---',
        msg.greeting,
        'with period',
        msg.period,
        '\n'
      ]
      console.log((info.join(' ')).magenta)
    })
  })
}

Master.prototype.post_interval = function (config) {
  var self = this

  setInterval(function () {
    var random = Math.ceil(
        Math.random() * (self.workerIds.length - 1)
      ) % self.workerIds.length
    var worker = cluster.workers[random]
    worker.send({
      greeting: config.message + worker.id,
      timestamp: self.timestamp()
    })
  }, config.interval)
}

Master.start = function (isMaster) {
  isMaster && new Master()
}

Master.start(cluster.isMaster)