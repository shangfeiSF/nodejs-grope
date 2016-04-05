var colors = require('colors')
var superagent = require('superagent')

// superagent GET 的使用方式：
superagent
  .get('http://localhost:8080/users')
  .query({order: 'desc'})
  .query({range: '1, 2'})
  .query({tag: 'express-superagent-GET-1'})
  .query({format: 'true'})
  .end(function (err, res) {
    console.log('[GET #1] -- ' + res.text.green)
  })

superagent('GET', 'http://localhost:8080/users')
  .query({order: 'asc', range: '0, 1'})
  .query('tag=express-superagent-GET-2&format=true')
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
  // superagent set方法设置header（服务端全部转换为小写的key, 即api-key）
  .set('API-KEY', 'express-superagent-POST#1')
  .send({
    name: 'xiaoshao',
    authority: 'developer'
  })
  .end(function (err, res) {
    console.log('[POST #1] -- '.red + res.text.cyan)
    // superagent DELTE 的使用方式：
    superagent.delete('http://localhost:8080/user/1')
      .set('Tag', 'express-superagent-DELETE#1')
      .end(function (err, res) {
        console.log('[DELETE #1] -- ' + res.text.yellow)
      })
  })

superagent('POST', 'http://localhost:8080/create')
  .set('Content-Type', 'application/json')
  .send('{"name": "yuncong", "authority": "admin"}')
  // superagent set方法设置header（服务端全部转换为小写的key, 即api-key）
  .set('API-KEY', 'express-superagent-POST#2')
  .end(function (err, res) {
    console.log('[POST #2] -- ' + res.text.cyan)
    // superagent DELTE 的使用方式：
    superagent.del('http://localhost:8080/user/2')
      .end(function (err, res) {
        console.log('[DELETE #2] -- ' + res.text.yellow)
      })
  })
