'use strict';
/*jshint asi: true*/

var testLib = require('./utils/test-lib')
  , test = require('tap').test
  , baseUrl = 'http://code.jquery.com/'

test('jquery versions 1.6.4 - 1.8.3', function (t) {
  var shimConfig = { jquery: {  exports: '$' } }
  var jqs = [ 
      { name: 'jquery-1.6.4.min.js'
      , test: function (t, resolved) { t.equals(resolved().jquery, '1.6.4', 'shims jquery 1.6.4') }
      }
    , { name: 'jquery-1.7.2.min.js'
      , test: function (t, resolved) { t.equals(resolved().jquery, '1.7.2', 'shims jquery 1.7.2') }
      }
    , { name: 'jquery-1.8.3.min.js'
      , test: function (t, resolved) { t.equals(resolved().jquery, '1.8.3', 'shims jquery 1.8.3') }
      }
    ]

  t.plan(jqs.length);

  jqs.forEach(function (jq) {
    jq.shimConfig = shimConfig
    jq.baseUrl = baseUrl
    testLib(t, jq);
  });
});
