'use strict';

var request = require('request')
  , fs      = require('fs')
  , path = require('path')
  , browserify = require('browserify')
  ;

function bundle() {
  // This is function is the important part and should be similar to what you would use for your project
  var builtFile = path.join(__dirname, 'js/build/bundle.js');

  // please not that browserify-shim is no longer necessary here because underscore is commonJS compatible
  // and browserify v2.0 added the 'expose' option

  browserify()
    .require(require.resolve('./js/vendor/underscore-min.js'), { expose: 'underscore' })
    .require(require.resolve('./js/entry.js'), { entry: true })
    .bundle(function (err, src) {
      if (err) return console.error(err);

      fs.writeFileSync(builtFile, src);
      console.log('Build succeeded, open index.html to see the result.');
    });
}

// Normally underscore-min.js would be in vendor folder already, but I wanted to avoid spreading underscores all over github ;)
// So lets download underscore and then run the bundler.
request('http://underscorejs.org/underscore-min.js', function(err, resp, body) {
  var underscoreFile = path.join(__dirname, 'js/vendor/underscore-min.js');

  fs.writeFileSync(underscoreFile, body);

  bundle();
});
