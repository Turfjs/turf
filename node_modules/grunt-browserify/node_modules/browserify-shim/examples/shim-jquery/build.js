'use strict';

var request = require('request')
  , fs      = require('fs')
  , path = require('path')
  , browserify = require('browserify')
  , shim = require('../../')
  ;

function bundle() {
  // This is function is the important part and should be similar to what you would use for your project
  var builtFile = path.join(__dirname, 'js/build/bundle.js');

  shim(browserify(), {
      jquery: { path: './js/vendor/jquery.js', exports: '$' }
  })
  .require(require.resolve('./js/entry.js'), { entry: true })
  .bundle(function (err, src) {
    if (err) return console.error(err);

    fs.writeFileSync(builtFile, src);
    console.log('Build succeeded, open index.html to see the result.');
  });
}

// Normally jquery.js would be in vendor folder already, but I wanted to avoid spreading jquerys all over github ;)
// So lets download jquery and then run the bundler.
request('http://code.jquery.com/jquery-1.8.3.min.js', function(err, resp, body) {
  var jqueryFile = path.join(__dirname, 'js/vendor/jquery.js');

  fs.writeFileSync(jqueryFile, body);

  bundle();
});
