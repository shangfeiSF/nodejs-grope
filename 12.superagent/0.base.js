var colors = require('colors')
var superagent = require('superagent')

// superagent GET 的使用方式：
superagent
  .get('http://localhost:8080/users')
  .end(function (err, res) {
    console.log('[GET #1] -- ' + res.text.green)
  })

superagent('GET', 'http://localhost:8080/users')
  .end(function (err, res) {
    console.log('[GET #2] -- ' + res.text.green)
  })

// superagent 默认是GET：只用GET可以使用这种方式：
superagent('http://localhost:8080/users', function (err, res) {
  console.log('[GET #3] -- ' + res.text.green)
})

// superagent POST 的使用方式：
superagent
  .post('http://localhost:8080/create')
  .send({
    name: 'yuncong',
    authority: 'developer'
  })
  .end(function (err, res) {
    console.log('[POST #1] -- '.red + res.text.cyan)
    // superagent DELTE 的使用方式：
    superagent.delete('http://localhost:8080/user/1')
      .end(function (err, res) {
        console.log('[DELETE #1] -- ' + res.text.yellow)
      })
  })

superagent('POST', 'http://localhost:8080/create')
  .send({
    name: 'yuncong',
    authority: 'admin'
  })
  .end(function (err, res) {
    console.log('[POST #2] -- ' + res.text.cyan)
    // superagent DELTE 的使用方式：
    superagent.del('http://localhost:8080/user/2')
      .end(function (err, res) {
        console.log('[DELETE #2] -- ' + res.text.yellow)
      })
  })
