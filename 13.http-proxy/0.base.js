var http = require('http'), httpProxy = require('http-proxy'), path = require('path'), url = require('url')

var proxy = httpProxy.createProxyServer({});

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
});

var server = require('http').createServer(function (req, res) {
  // 在这里可以自定义你的路由分发
  var host = req.headers.host
  if (host === 'smart-garage.daily.taobao.net') {
    proxy.web(req, res, {target: 'http://127.0.0.1:6027'})
  }
});

http.createServer(function (req, res) {
  var pathname = url.parse(req.url).pathname
  res.writeHead(200, {'Content-Type': 'text/plain'});
  fs.readFile(path.join(__dirname, '../asset', pathname),
    function (error, data) {
      response.writeHead(200)
      response.end(data)
    })
  res.end();
}).listen(6027);

console.log("listening on port 80")
server.listen(80);