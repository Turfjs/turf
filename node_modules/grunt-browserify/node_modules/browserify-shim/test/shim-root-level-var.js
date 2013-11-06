'use strict';
/*jshint asi: true */
var browserify = require('browserify')
  , test = require('tap').test
  , vm = require('vm')
  , shim = require('..')

test('when I shim a module that declares its export as a var on the root level instead of attaching it to the window', function (t) {

  shim(browserify(), {
      rootvar: { path: './fixtures/shims/root-level-var.js', exports: 'nineties' }
    })
    .require(require.resolve('./fixtures/entry-requires-root-level-var.js'), { expose: 'entry' })
    .bundle(function (err, src) {
      if (err) return t.fail(err);

      var ctx = { window: {}, console: console };
      ctx.self = ctx.window;
      var require_ = vm.runInNewContext(src, ctx);

      t.equal(
          require_('entry').message
        , "I declare vars on the script level and expect them to get attached to the window because I'm doin' it 90s style baby!"
        , 'requires crippled jquery and gets version'
      );
      t.end()
    });
})
