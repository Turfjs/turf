// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var test = require('tape');
var shims = require('../../builtin/_shims.js');

var util = require('util');

test('util.isArray', function (t) {
  t.equal(true, util.isArray([]));
  t.equal(true, util.isArray(Array()));
  t.equal(true, util.isArray(new Array()));
  t.equal(true, util.isArray(new Array(5)));
  t.equal(true, util.isArray(new Array('with', 'some', 'entries')));
  t.equal(false, util.isArray({}));
  t.equal(false, util.isArray({ push: function() {} }));
  t.equal(false, util.isArray(/regexp/));
  t.equal(false, util.isArray(new Error()));
  t.equal(false, util.isArray(shims.create(Array.prototype)));
  t.end();
});

test('util.isRegExp', function (t) {
  t.equal(true, util.isRegExp(/regexp/));
  t.equal(true, util.isRegExp(RegExp()));
  t.equal(true, util.isRegExp(new RegExp()));
  t.equal(false, util.isRegExp({}));
  t.equal(false, util.isRegExp([]));
  t.equal(false, util.isRegExp(new Date()));
  t.equal(false, util.isRegExp(shims.create(RegExp.prototype)));
  t.end();
});

test('util.isDate', function (t) {
  t.equal(true, util.isDate(new Date()));
  t.equal(true, util.isDate(new Date(0)));
  t.equal(false, util.isDate(Date()));
  t.equal(false, util.isDate({}));
  t.equal(false, util.isDate([]));
  t.equal(false, util.isDate(new Error()));
  t.equal(false, util.isDate(shims.create(Date.prototype)));
  t.end();
});

test('util.isError', function (t) {
  t.equal(true, util.isError(new Error()));
  t.equal(true, util.isError(new TypeError()));
  t.equal(true, util.isError(new SyntaxError()));
  t.equal(false, util.isError({}));
  t.equal(false, util.isError({ name: 'Error', message: '' }));
  t.equal(false, util.isError([]));
  t.equal(false, util.isError(shims.create(Error.prototype)));
  t.end();
});

test('util._extend', function (t) {
  t.deepEqual(util._extend({a:1}),             {a:1});
  t.deepEqual(util._extend({a:1}, []),         {a:1});
  t.deepEqual(util._extend({a:1}, null),       {a:1});
  t.deepEqual(util._extend({a:1}, true),       {a:1});
  t.deepEqual(util._extend({a:1}, false),      {a:1});
  t.deepEqual(util._extend({a:1}, {b:2}),      {a:1, b:2});
  t.deepEqual(util._extend({a:1, b:2}, {b:3}), {a:1, b:3});
  t.end();
});
