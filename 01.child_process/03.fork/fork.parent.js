var child_process = require('child_process')
var fork = require('child_process').fork

var normal_seed = Math.random()
var special_seed = Math.random()

var normal = fork('fork.child.js', ['normal', normal_seed])
var special = fork('fork.child.js', ['special', special_seed])

setTimeout(function () {
  normal.send({
    name: 'normal',
    seed: normal_seed
  })

  setTimeout(function () {
    special.send({
      name: 'special',
      seed: special_seed
    })
  }, 2000)

}, 2000)

normal.on('message', function (m) {
  console.log('--------------------------------------------------')
  console.log(m.seed)
  if (m.name === 'normal-response') {
    console.log(normal_seed + '-normal-storein-parent')
  }
})

special.on('message', function (m) {
  console.log('--------------------------------------------------')
  console.log(m.seed)
  if (m.name === 'special-response') {
    console.log(special_seed + '-special-storein-parent')
  }
})