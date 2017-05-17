var system = require('system'),
    port,
    server;

if (system.args.length !== 2) {
  console.log('Usage: index.js <port>');
  phantom.exit(1);
}

port = system.args[1];
server = require('webserver').create();
service = server.listen(port, function(req, resp) {
  console.log('Got request at: ' + new Date());
  var query = queryString(req.url);

  readArticle(query.url, function(err, article) {
    if (err) {
      resp.statusCode = 400;
      resp.headers = {
        'Cache': 'no-cache',
        'Content-Type': 'application/json'
      };
      resp.write(JSON.stringify({message: err}));
      return resp.close();
    }

    resp.statusCode = 200;
    resp.headers = {
      'Cache': 'no-cache',
      'Content-Type': 'application/json'
    };
    resp.write(JSON.stringify(article));
    return resp.close();
  });
});

if (!service) {
  console.log('Cannot listen on port ' + port);
  phantom.exit();
}
console.log('Listening on port ' + port);


function queryString(url) {
  // taken from http://stackoverflow.com/questions/26920471/phantomjs-get-url-parameter
  // adapted from http://stackoverflow.com/a/8486188
  var query = url.substr(url.indexOf("?")+1);
  var result = {};
  query.split("&").forEach(function(part) {
    var e = part.indexOf("=")
    var key = part.substr(0, e);
    var value = part.substr(e+1);
    console.log(value);
    result[key] = decodeURIComponent(decodeURIComponent(value));
    console.log(result[key]);
  });
  return result;
}

function readArticle(url, callback) {
  var page = require('webpage').create();
  page.settings.loadImages = false;

  console.log('Opening ' + url);
  page.open(url, function(status) {
    console.log('status ' + status);
    if (status !== 'success') {
      return callback('Got status: ' + status);
    }

    if (!page.injectJs('Readability.js')) {
      console.log('Failed injecting script');
      return callback("Failed inject Readability.js");
    }

    console.log('Parsing article');
    var article = page.evaluate(function() {
      var loc = document.location;
      var uri = {
        spec: loc.href,
        host: loc.host,
        prePath: loc.protocol + "//" + loc.host,
        scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
        pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
      };
      var article = new Readability(uri, document).parse();
      return article;
    });
    return callback(null, article);
  });
}
