http = require('http');
fs = require('fs');
server = http.createServer( function(req, res) {

    console.dir('req.param', req.param);
    console.log('req.url', req.url);

    if (req.method == 'POST') {
        //console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            //console.log("Partial body: " + body);
        });
        req.on('end', function () {
            console.log("Body", body);
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        var data = fs.readFileSync('test-post.json');
        res.end(data);
    } else {
        //console.log("GET", req.url);
        var data = fs.readFileSync('test-get.json');
        if (req.url == '/bridge.html') data = fs.readFileSync('bridge.html');
        if (req.url == '/connect.utils.js') data = fs.readFileSync('connect.utils.js');
        if (req.url == '/connect.bridge.js') data = fs.readFileSync('connect.bridge.js');
          
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    }

});

port = 8081;
host = 'localhost';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);