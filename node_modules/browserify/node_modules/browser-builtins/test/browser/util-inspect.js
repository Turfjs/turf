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

var util = require('util');

test('util.inspect - test for sparse array', function (t) {
  var a = ['foo', 'bar', 'baz'];
  t.equal(util.inspect(a), '[ \'foo\', \'bar\', \'baz\' ]');
  delete a[1];
  t.equal(util.inspect(a), '[ \'foo\', , \'baz\' ]');
  t.equal(util.inspect(a, true), '[ \'foo\', , \'baz\', [length]: 3 ]');
  t.equal(util.inspect(new Array(5)), '[ , , , ,  ]');
  t.end();
});

test('util.inspect -  exceptions should print the error message, not \'{}\'', function (t) {
  t.equal(util.inspect(new Error()), '[Error]');
  t.equal(util.inspect(new Error('FAIL')), '[Error: FAIL]');
  t.equal(util.inspect(new TypeError('FAIL')), '[TypeError: FAIL]');
  t.equal(util.inspect(new SyntaxError('FAIL')), '[SyntaxError: FAIL]');
  t.end();
});
