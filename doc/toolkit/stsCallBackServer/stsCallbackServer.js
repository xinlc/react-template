var http = require('http');

http.createServer(function(request, response) {
  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];

  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    // At this point, we have the headers, method, url and body, and can now
    // do whatever we need to in order to respond to this request.
    console.info(headers);
    console.info(method);
    console.info(url);
    console.info(body);
    var responseJsonStr = JSON.stringify({
      headers:headers,
      method:method,
      url:url,
      body:body
     })
    response.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'bacon',
      'Content-Length':responseJsonStr.length
    });

    response.end(responseJsonStr);
  });
}).listen(3000); // Activates this server, listening on port 8080.

// docker run -it --rm --name sts-callback -p 3000:3000 -v "$PWD":/usr/src/app -w /usr/src/app node node stsCallbackServer.js
