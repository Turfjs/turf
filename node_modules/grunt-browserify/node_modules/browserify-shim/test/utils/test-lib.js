'use strict';
/*jshint asi: true*/

var request =  require('request')
  , fs      =  require('fs')
  , vm      =  require('vm')
  , path    =  require('path')
  , shim    =  require('../..')
  , jsdom   =  require('jsdom').jsdom
  , shimsdir  =  path.join(__dirname, '..', 'fixtures', 'shims')
  , entryFile =  path.join(__dirname, '..', 'fixtures', 'entry-straight-export.js')

var html = 
    '<!DOCTYPE html>'
  + '<html>'
  + '    <head>'
  + '        <title>Some empty page</title>'
  + '    </head>'
  + '    <body>'
  + '    </body>'
  + '</html>'

function generateEntry(alias) {
  // just pass in exported shim in order to ensure it can be required
  return ('module.exports = require("' + alias + '");\n')
}

require('tap').on('end', function () {
//  fs.unlinkSync(file);
  fs.unlinkSync(entryFile);
})

module.exports = function testLib(t, opts) {
  var baseUrl    =  opts.baseUrl
    , name       =  opts.name
    , shimConfig =  opts.shimConfig
    , runTest    =  opts.test

  request( baseUrl + name, function(err, resp, body) {
    var file = path.join(shimsdir, name)
      , firstConfigKey = Object.keys(shimConfig)[0]
      , firstConfig = shimConfig[firstConfigKey]

    firstConfig.path = file;

    fs.writeFileSync(file, body, 'utf-8');
    fs.writeFileSync(entryFile, generateEntry(firstConfigKey), 'utf-8');

    shim(require('browserify')(), shimConfig)
      .require(require.resolve(entryFile), { expose: 'entry' })
      .bundle(function (err, src) {

        fs.unlinkSync(file);

        if (err) { t.fail(err); return t.end() } 

        var window = jsdom(html).createWindow()
          , context = vm.createContext(window)

        Object.keys(window).forEach(function (k) { context[k] = window[k] })
        var require_ = vm.runInContext(src, context);

        runTest(t, require_('entry'));
      });
  });
};
