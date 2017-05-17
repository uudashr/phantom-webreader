var waitFor = require('./waitFor')

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

    console.log('Wait for some element to be loaded...');
    waitFor(function check() {
      return page.evaluate(function() {
        // assume h1 should be loaded
        return document.querySelector('h1') !== undefined;
      })
    }, function loaded() {
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
      }, 3000);
      return callback(null, article);
    });

  });
}

module.exports.readArticle = readArticle;
