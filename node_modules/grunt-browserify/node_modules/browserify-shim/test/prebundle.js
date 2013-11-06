'use strict';
/*jshint asi: true */
var browserify = require('browserify')
  , test = require('tap').test
  , shim = require('..')

test('\n# when I shim "jquery"', function (t) {
  
  var entryPath = './fixtures/entry-requires-jquery.js'
    , entryFullPath = require.resolve(entryPath)
    , jqueryPath = './fixtures/shims/crippled-jquery'
    , jqueryFullPath = require.resolve(jqueryPath)

  var prebundle = browserify()

  shim(prebundle, { 
    jquery: { path: jqueryPath, exports: '$' }
  })
  .require(entryFullPath, { expose: 'entry' })
  
  t.equal(prebundle._pending, 2, 'before bundling: has two pending')
  t.equal(Object.keys(prebundle.exports).length, 0, 'before bundling: has no exports')
  t.equal(Object.keys(prebundle._mapped).length, 0, 'before bundling: has no mappings')
  t.equal(prebundle.files.length, 0, 'before bundling: has no files')

  prebundle.bundle(function (err, src) {

    t.equal(Object.keys(prebundle.exports).length, 2, 'after bundling: has two exports')
    t.ok(prebundle.exports[jqueryFullPath], 'after bundling: exports jquery under its fullPath')
    t.ok(prebundle.exports[entryFullPath], 'after bundling: exports entry under its fullPath')

    t.equal(prebundle.files.length, 2, 'after bundling: has two files')
    t.equal(prebundle._expose[jqueryFullPath], 'jquery', 'after bundling: exposes jquery with name "jquery" under its full path')
    t.equal(prebundle._expose[entryFullPath], 'entry', 'after bundling: exposes entry with name "entry" under its full path')

    t.equal(Object.keys(prebundle._mapped).length, 2, 'after bundling: has two mappings')
    t.equal(prebundle._mapped['jquery'], jqueryFullPath, 'after bundling: maps "jquery" to its full path')
    t.equal(prebundle._mapped['entry'], entryFullPath, 'after bundling: maps "entry" to its full path')

    t.end() 
  })
});
