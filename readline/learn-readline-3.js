var readline = require('readline');
var u, p, verifycode;

var rl = readline.createInterface({
    "input": process.stdin,
    "output": process.stdout,
    completer: function(line) {
        var completions = 'login logout getFriends getGroups'.split(' ')
        var hits = completions.filter(function(c) { return c.indexOf(line) == 0 })
        return [hits.length ? hits : completions, line]
    },
    // 默认字符Tab(/t)代表自动补全
    // 在process.stdin中输入字符串lo后, press Tab可以实现自动补全
    terminal: true
});
// setPrompt(prompt, length), length是光标的位置
rl.setPrompt('Input command: ');
rl.prompt(true);
var commands = {
    'login': function(){
        rl.question("Input your account:", function(u) {
            u = u;
            rl.question("Input your password:", function(p) {
                p = p;
                console.log('Account:' + u + ', Password:' + p);
            });
        });
    },
    'logout': function(){
        console.log('logout...');
        // 使用wirte模拟TTY的 Ctrl + c
        rl.write(null, {ctrl: true, name: 'c'});
    },
    'getFriends': function(){
        console.log('getFriends...');
    },
    'getGroups': function(){
        console.log('getGroups...');
    }
};

rl.on('line', function (cmd) {
    switch(cmd.trim()){
        case 'login':
            commands[cmd.trim()]();
            break;
        case 'logout':
            commands[cmd.trim()]();
            break;
        case 'getFriends':
            commands[cmd.trim()]();
            break;
        case 'getGroups':
            commands[cmd.trim()]();
            break;
        default:
            console.log(cmd.trim());
    }
    rl.prompt(true);
});

// Ctrl + c
rl.on('SIGINT', function() {
    rl.question('Sure to exit ? (y)es or (n)o ', function(answer) {
        if (answer.match(/^y(es)?$/i)) {
            rl.close();
        }else {
            rl.prompt(true);
        }
    });
});

// Ctrl + d
rl.on('close', function() {
    console.log('Welcome back!');
    process.exit(0);
});
