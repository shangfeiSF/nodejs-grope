var colors = require('colors')
var superagent = require('superagent')

// GET请求的方式#1
superagent
  .get('http://localhost:8080/users')
  // url传递参数的方式#1
  .query({order: 'desc'})
  .query({range: '1, 2'})
  .query({tag: 'express-superagent-GET-1'})
  .query({format: 'true'})
  .end(function (err, res) {
    console.log('[GET #1] -- ' + res.text.green)
  })

// GET请求的方式#2
superagent('GET', 'http://localhost:8080/users')
  .query({order: 'asc', range: '0, 1'})
  // url传递参数的方式#2
  .query('tag=express-superagent-GET-2&format=true')
  .end(function (err, res) {
    console.log('[GET #2] -- ' + res.text.green)
  })

// superagent 默认是GET, 只有GET请求可以使用这种方式#3
superagent('http://localhost:8080/users', function (err, res) {
  console.log('[GET #3] -- ' + res.text.green)
})

// POST请求的方式#1
superagent
  .post('http://localhost:8080/create')
  // 设置headers的方式#1
  // Server会将headers中的key转换为lowerCase, 即api-key
  .set('API-KEY', 'express-superagent-POST#1')
  // superagent 默认的'Content-Type就是application/json
  .set('Content-Type', 'application/json')
  // send数据的方式#1
  .send({
    name: 'xiaoshao',
    authority: 'developer'
  })
  .end(function (err, res) {
    console.log('[POST #1] -- '.red + res.text.cyan)
    // DELTE请求的方式#1
    superagent.delete('http://localhost:8080/user/1')
      .set('Tag', 'express-superagent-DELETE#1')
      .end(function (err, res) {
        console.log('[DELETE #1] -- ' + res.text.yellow)
      })
  })

// POST请求的方式#2
superagent('POST', 'http://localhost:8080/create')
  .set('Content-Type', 'application/json')
  // send数据的方式#2
  .send('{"name": "yuncong", "authority": "admin"}')
  .set('API-KEY', 'express-superagent-POST#2')
  .end(function (err, res) {
    console.log('[POST #2] -- ' + res.text.cyan)
    // DELTE请求的方式#2
    superagent.del('http://localhost:8080/user/2')
      .end(function (err, res) {
        console.log('[DELETE #2] -- ' + res.text.yellow)
      })
  })
