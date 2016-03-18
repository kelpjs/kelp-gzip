const http = require('http');
const kelp = require('kelp');
const gzip = require('../');

const app = kelp();

app.use(gzip, function(req, res){
  res.end('hi');
});

http.createServer(app).listen(3000);
