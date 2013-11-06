'use strict';
/*jshint asi: true*/

var testLib = require('./utils/test-lib')
var test = require('tap').test
  , baseUrl = 'https://raw.github.com/bartaz/impress.js/'

test('impressjs 0.5.3', function (t) {
  var shimConfig = { impressjs: {  exports: 'impress' } }
  t.plan(1)
  testLib(t, { 
      name: 'impress.js'
    , test: function (t, resolved) { t.equals(typeof resolved().init, 'function', 'shims impressjs 0.5.3') }
    , shimConfig: shimConfig
    , baseUrl: baseUrl + '0.5.3/js/'
  })
});
