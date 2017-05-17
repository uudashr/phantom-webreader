var system = require('system'),
    reader = require('./reader'),
    port,
    server;

if (system.args.length !== 2) {
  console.log('Usage: index.js <port>');
  phantom.exit(1);
}

port = system.args[1];
server = require('webserver').create();
service = server.listen(port, function(req, resp) {
  var t = Date.now()
  console.log('Got request at: ' + new Date(t));
  var query = queryString(req.url);

  reader.readArticle(query.url, function(err, article) {
    if (err) {
      resp.statusCode = 400;
      resp.headers = {
        'Cache': 'no-cache',
        'Content-Type': 'application/json'
      };
      resp.write(JSON.stringify({message: err}));
      console.log('Respond 400 - took ' + (Date.now() - t) + ' msec')
      return resp.close();
    }

    resp.statusCode = 200;
    resp.headers = {
      'Cache': 'no-cache',
      'Content-Type': 'application/json'
    };
    resp.write(JSON.stringify(article));
    console.log('Respond 200 - took ' + (Date.now() - t) + ' msec')
    return resp.close();
  });
});

if (!service) {
  console.log('Cannot listen on port ' + port);
  phantom.exit();
}
console.log('Listening on port ' + port + ' ...');


function queryString(url) {
  // taken from http://stackoverflow.com/questions/26920471/phantomjs-get-url-parameter
  // adapted from http://stackoverflow.com/a/8486188
  var query = url.substr(url.indexOf("?")+1);
  var result = {};
  query.split("&").forEach(function(part) {
    var e = part.indexOf("=")
    var key = part.substr(0, e);
    var value = part.substr(e+1);
    result[key] = decodeURIComponent(decodeURIComponent(value));
  });
  return result;
}
