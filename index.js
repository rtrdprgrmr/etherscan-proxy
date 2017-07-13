/*
Copyright (c) 2017 rtrdprgrmr

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var net = require('net');
var https = require('https');
var http = require('http');
var url = require('url');

var port = process.env.PORT || 8000;

var server = http.createServer(function(req, res) {
    //console.log("request to", req.url);
    //console.log("method", req.method);
    //console.log("headers", req.headers);
    var headers = {};
    for (var i in req.headers) {
        if (i === 'host') continue;
        headers[i] = req.headers[i];
    }
    var options = {
        method: req.method,
        path: url.parse(req.url).path,
        host: "etherscan.io",
        port: 443,
        headers: headers,
    };
    //console.log("options", options);
    var req2 = https.request(options, function(res2) {
        //console.log("response from " + req2.url + " status=" + res2.statusCode);
        res.writeHead(res2.statusCode, res2.statusMessage, res2.headers)
        res2.on('data', function(data) {
            //console.log("res2 data");
            res.write(data);
        });
        res2.on('end', function() {
            //console.log("res2 end");
            res.end();
        });
    });
    req.on('data', function(data) {
        //console.log("req data");
        req2.write(data);
    });
    req.on('end', function() {
        //console.log("req end");
        req2.end();
    });
});

server.listen(port);
