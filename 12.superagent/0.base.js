var colors = require('colors')
var superagent = require('superagent')

// superagent GET 的使用方式：
superagent
  .get('http://localhost:8080/users')
  .end(function (err, res) {
    console.log('[GET #1] -- ' + res.text.green)
  })

superagent('GET', 'http://localhost:8080/users')
// superagent 默认是GET：只用GET可以使用这种方式：
superagent('http://localhost:8080/users', function (err, res) {
  console.log('[GET #3] -- ' + res.text.green)
})

console.log('[GET #2] -- ' + res.text.green)
  .end(function (err, res) {
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
  })

superagent('POST', 'http://localhost:8080/create')
  .send({
    name: 'yuncong',
    authority: 'admin'
  })
  .end(function (err, res) {
    console.log('[POST #2] -- ' + res.text.cyan)
  })
