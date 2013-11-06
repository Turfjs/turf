'use strict';
/*jshint asi: true */
var browserify = require('browserify')
  , test = require('tap').test
  , vm = require('vm')
  , shim = require('..')

test('when I shim "jquery" to a crippled jquery filerequire it inside the entry file', function (t) {

  shim(browserify(), {
    jquery: { path: './fixtures/shims/crippled-jquery', exports: '$' }
  })
  .require(require.resolve('./fixtures/entry-requires-jquery.js'), { expose: 'entry' })
  .bundle(function (err, src) {
    if (err) { t.fail(err); return t.end() }

    var ctx = { window: {}, console: console };
    ctx.self = ctx.window;
    var require_ = vm.runInNewContext(src, ctx);

    t.equal(require_('entry').getJqueryVersion(), '1.8.3', 'requires crippled jquery and gets version');
    t.end()
  })
})
