var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World'+  ', ' + proces.env.NODE_ENV);
}).listen(port);
console.log('started on ' + port + ', ' + proces.env.NODE_ENV);