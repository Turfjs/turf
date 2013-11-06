'use strict';
/*jshint asi: true */
var browserify = require('browserify')
  , test = require('tap').test
  , vm = require('vm')
  , shim = require('..')

var jquery = { path: './fixtures/shims/crippled-jquery', exports: '$' };
var underscore = { path: './fixtures/shims/lib-exporting-_', exports: null };
var dependent = {
    path: './fixtures/shims/lib-depending-on-global-jquery'
  , exports: 'dep'
  , depends: { jquery: '$' }
};
var multidependent = {
    path: './fixtures/shims/lib-depending-on-global-jquery-and-_'
  , exports: 'dep'
  , depends: { jquery: '$', underscore: '_' }
};

test('\nwhen I shim "jquery" and shim a lib that depends on it', function (t) {

  shim(browserify(), {
      jquery    :  jquery
    , dependent :  dependent
  })
  .bundle(function (err, src) {
    if (err) return t.fail(err)

    src += '\nrequire("dependent")';

    var ctx = { window: {}, console: console };
    ctx.self = ctx.window;
    vm.runInNewContext(src, ctx);

    t.equal(ctx.window.dep.jqVersion, '1.8.3', 'when dependent gets required, $ is attached to the window');
    t.end()
  });

});

test('\nwhen I shim "jquery" and _ lib in debug mode and shim a lib that depends on both', function (t) {

  shim(browserify(), {
      jquery         :  jquery
    , underscore     :  underscore
    , multidependent :  multidependent
  })
  .bundle(function (err, src) {
    if (err) return t.fail(err)

    src += '\nrequire("multidependent")';

    var ctx = { window: {}, console: console };
    ctx.self = ctx.window;
    vm.runInNewContext(src, ctx);

    t.equal(ctx.window.dep.jqVersion, '1.8.3', 'when multidependent gets required, $ is attached to the window');
    t.equal(ctx.window.dep._(), 'super underscore', 'and _ is attached to the window');
    t.end()
  })
});
