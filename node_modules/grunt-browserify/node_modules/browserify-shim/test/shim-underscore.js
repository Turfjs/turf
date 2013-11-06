'use strict';
/*jshint asi: true*/

var testLib = require('./utils/test-lib')
  , test = require('tap').test
  , baseUrl = 'https://raw.github.com/documentcloud/underscore/master/'

// Not necessary to shim underscore, but serves as a good test case since it tries very hard to interface with commonJS
test('underscore master', function (t) {
  var shimConfig = { underscore: {  exports: '_' } }
  t.plan(1)
  testLib(t, { 
      name: 'underscore.js'
    , test: function (t, resolved) { t.equals(typeof resolved().each, 'function', 'shims underscore master') }
    , shimConfig: shimConfig
    , baseUrl: baseUrl
  })
});
