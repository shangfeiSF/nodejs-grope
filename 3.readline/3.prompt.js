var readline = require('readline')

var rl = readline.createInterface({
  terminal: true,
  "input": process.stdin,
  "output": process.stdout,
  completer: function (line) {
    var completions = 'login logout getFriends getGroups'.split(' ')
    var hits = completions.filter(function (fn) {
      return fn.indexOf(line) == 0
    })
    return [hits.length ? hits : completions, line]
  }
})

rl.setPrompt('Input command: ')
rl.prompt(true)

var commands = {
  'login': function () {
    rl.question("Input your account:", function (account) {
      rl.question("Input your password:", function (password) {
        console.log('Account:' + account + ', Password:' + password)
      })
    })
  },
  'logout': function () {
    console.log('logout...')
    // Simulate Ctrl + c
    rl.write(null, {ctrl: true, name: 'c'})
  },
  'getFriends': function () {
    console.log('getFriends...')
  },
  'getGroups': function () {
    console.log('getGroups...')
  }
}

rl.on('line', function (cmd) {
  switch (cmd.trim()) {
    case 'login':
      commands[cmd.trim()]()
      break
    case 'logout':
      commands[cmd.trim()]()
      break
    case 'getFriends':
      commands[cmd.trim()]()
      break
    case 'getGroups':
      commands[cmd.trim()]()
      break
    default:
      console.log(cmd.trim())
  }
  rl.prompt(true)
})

// when input Ctrl + c
rl.on('SIGINT', function () {
  rl.question('Sure to exit ? (y)es or (n)o ', function (answer) {
    if (answer.match(/^y(es)?$/i)) {
      rl.close()
    } else {
      rl.prompt(true)
    }
  })
})

// when input Ctrl + d
rl.on('close', function () {
  console.log('Welcome back!')
  process.exit(0)
})
