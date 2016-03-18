var argv = process.argv.slice(2)
console.log('--------------------------------------------------')
console.log(argv[0])
console.log(argv[1])
process.on('message', function (m) {
  if (m.name === 'normal') {
    process.send({
      name: 'normal-response',
      seed: m.seed + '-normal-from-child'
    })
  } else if (m.name === 'special') {
    process.send({
      name: 'special-response',
      seed: m.seed + '-special-from-child'
    })
  }
})