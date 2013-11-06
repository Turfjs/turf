'use strict';
/*jshint asi: true */
var browserify = require('browserify')
  , test = require('tap').test
  , vm = require('vm')
  , shim = require('..')

test('when I shim a commonJS module in order to alias it without installing it as a node_module', function (t) {

  t.test('when bundled', function (t) {
    var b = browserify()
    shim(b, { cjs: { path: './fixtures/shims/commonjs-module', exports: null } })

    b.require(__dirname + '/fixtures/entry-requires-cjs.js', { expose: 'entry-requires-cjs' })
    b.bundle(function (err, src) {
      if (err) { return t.fail(err) }
      var ctx = { window: {} };
      ctx.self = ctx.window;
      var require_ = vm.runInNewContext(src, ctx);
      t.equal(require_('entry-requires-cjs'), 'super duper export', 'requires cjs properly from the given path');
      t.end()
    })
  })
})
