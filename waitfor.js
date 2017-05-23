// Based on: https://github.com/ariya/phantomjs/blob/master/examples/waitfor.js
'use strict';

function waitFor(testFn, callback, timeOutMillis) {
  var maxTimeoutMillis = timeOutMillis ? timeOutMillis : 3000
  var start = Date.now();
  if (testFn()) {
    return callback(null);
  }

  var remaining = Date.now() - start;
  var i = setInterval(function check() {
    if ((Date.now() - start) > maxTimeoutMillis) {
      callback('timeout');
      clearInterval(i);
      return;
    }

    if (testFn()) {
      callback(null);
      clearInterval(i);
      return;
    }
  }, Math.min(remaining, 250));
}

module.exports = waitFor;
