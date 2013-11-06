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

var assert = require('assert');

function makeBlock(f) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    return f.apply(this, args);
  };
}

test('assert.ok', function (t) {
  t.throws(makeBlock(assert, false), assert.AssertionError, 'ok(false)');

  t.doesNotThrow(makeBlock(assert, true), assert.AssertionError, 'ok(true)');

  t.doesNotThrow(makeBlock(assert, 'test', 'ok(\'test\')'));

  t.throws(makeBlock(assert.ok, false),
                assert.AssertionError, 'ok(false)');

  t.doesNotThrow(makeBlock(assert.ok, true),
                      assert.AssertionError, 'ok(true)');

  t.doesNotThrow(makeBlock(assert.ok, 'test'), 'ok(\'test\')');

  t.end();
});

test('assert.equal', function (t) {
  t.throws(makeBlock(assert.equal, true, false), assert.AssertionError, 'equal');

  t.doesNotThrow(makeBlock(assert.equal, null, null), 'equal');

  t.doesNotThrow(makeBlock(assert.equal, undefined, undefined), 'equal');

  t.doesNotThrow(makeBlock(assert.equal, null, undefined), 'equal');

  t.doesNotThrow(makeBlock(assert.equal, true, true), 'equal');

  t.doesNotThrow(makeBlock(assert.equal, 2, '2'), 'equal');

  t.doesNotThrow(makeBlock(assert.notEqual, true, false), 'notEqual');

  t.throws(makeBlock(assert.notEqual, true, true),
                assert.AssertionError, 'notEqual');
  t.end();
});

test('assert.strictEqual', function (t) {
  t.throws(makeBlock(assert.strictEqual, 2, '2'),
                assert.AssertionError, 'strictEqual');

  t.throws(makeBlock(assert.strictEqual, null, undefined),
                assert.AssertionError, 'strictEqual');

  t.doesNotThrow(makeBlock(assert.notStrictEqual, 2, '2'), 'notStrictEqual');

  t.end();
});

test('assert.deepEqual - 7.2', function (t) {
  t.doesNotThrow(makeBlock(assert.deepEqual, new Date(2000, 3, 14),
                      new Date(2000, 3, 14)), 'deepEqual date');

  t.throws(makeBlock(assert.deepEqual, new Date(), new Date(2000, 3, 14)),
                assert.AssertionError,
                'deepEqual date');

  t.end();
});

test('assert.deepEqual - 7.3', function (t) {
  t.doesNotThrow(makeBlock(assert.deepEqual, /a/, /a/));
  t.doesNotThrow(makeBlock(assert.deepEqual, /a/g, /a/g));
  t.doesNotThrow(makeBlock(assert.deepEqual, /a/i, /a/i));
  t.doesNotThrow(makeBlock(assert.deepEqual, /a/m, /a/m));
  t.doesNotThrow(makeBlock(assert.deepEqual, /a/igm, /a/igm));
  t.throws(makeBlock(assert.deepEqual, /ab/, /a/));
  t.throws(makeBlock(assert.deepEqual, /a/g, /a/));
  t.throws(makeBlock(assert.deepEqual, /a/i, /a/));
  t.throws(makeBlock(assert.deepEqual, /a/m, /a/));
  t.throws(makeBlock(assert.deepEqual, /a/igm, /a/im));

  var re1 = /a/;
  re1.lastIndex = 3;
  t.throws(makeBlock(assert.deepEqual, re1, /a/));

  t.end();
});

test('assert.deepEqual - 7.4', function (t) {
  t.doesNotThrow(makeBlock(assert.deepEqual, 4, '4'), 'deepEqual == check');
  t.doesNotThrow(makeBlock(assert.deepEqual, true, 1), 'deepEqual == check');
  t.throws(makeBlock(assert.deepEqual, 4, '5'),
            assert.AssertionError,
            'deepEqual == check');

  t.end();
});

test('assert.deepEqual - 7.5', function (t) {
  // having the same number of owned properties && the same set of keys
  t.doesNotThrow(makeBlock(assert.deepEqual, {a: 4}, {a: 4}));
  t.doesNotThrow(makeBlock(assert.deepEqual, {a: 4, b: '2'}, {a: 4, b: '2'}));
  t.doesNotThrow(makeBlock(assert.deepEqual, [4], ['4']));
  t.throws(makeBlock(assert.deepEqual, {a: 4}, {a: 4, b: true}),
            assert.AssertionError);
  t.doesNotThrow(makeBlock(assert.deepEqual, ['a'], {0: 'a'}));
  //(although not necessarily the same order),
  t.doesNotThrow(makeBlock(assert.deepEqual, {a: 4, b: '1'}, {b: '1', a: 4}));
  var a1 = [1, 2, 3];
  var a2 = [1, 2, 3];
  a1.a = 'test';
  a1.b = true;
  a2.b = true;
  a2.a = 'test';
  t.throws(makeBlock(assert.deepEqual, shims.keys(a1), shims.keys(a2)),
            assert.AssertionError);
  t.doesNotThrow(makeBlock(assert.deepEqual, a1, a2));

  t.end();
});

test('assert.deepEqual - instances', function (t) {
  // having an identical prototype property
  var nbRoot = {
    toString: function() { return this.first + ' ' + this.last; }
  };

  function nameBuilder(first, last) {
    this.first = first;
    this.last = last;
    return this;
  }
  nameBuilder.prototype = nbRoot;

  function nameBuilder2(first, last) {
    this.first = first;
    this.last = last;
    return this;
  }
  nameBuilder2.prototype = nbRoot;

  var nb1 = new nameBuilder('Ryan', 'Dahl');
  var nb2 = new nameBuilder2('Ryan', 'Dahl');

  t.doesNotThrow(makeBlock(assert.deepEqual, nb1, nb2));

  nameBuilder2.prototype = Object;
  nb2 = new nameBuilder2('Ryan', 'Dahl');
  t.throws(makeBlock(assert.deepEqual, nb1, nb2), assert.AssertionError);

  // String literal + object blew up my implementation...
  t.throws(makeBlock(assert.deepEqual, 'a', {}), assert.AssertionError);

  t.end();
});

function thrower(errorConstructor) {
  throw new errorConstructor('test');
}

test('assert - Testing the throwing', function (t) {
  var aethrow = makeBlock(thrower, assert.AssertionError);
  aethrow = makeBlock(thrower, assert.AssertionError);

  // the basic calls work
  t.throws(makeBlock(thrower, assert.AssertionError),
                assert.AssertionError, 'message');
  t.throws(makeBlock(thrower, assert.AssertionError), assert.AssertionError);
  t.throws(makeBlock(thrower, assert.AssertionError));

  // if not passing an error, catch all.
  t.throws(makeBlock(thrower, TypeError));

  // when passing a type, only catch errors of the appropriate type
  var threw = false;
  try {
    assert.throws(makeBlock(thrower, TypeError), assert.AssertionError);
  } catch (e) {
    threw = true;
    t.ok(e instanceof TypeError, 'type');
  }
  t.equal(true, threw,
               'a.throws with an explicit error is eating extra errors',
               assert.AssertionError);
  threw = false;

  // doesNotThrow should pass through all errors
  try {
    assert.doesNotThrow(makeBlock(thrower, TypeError), assert.AssertionError);
  } catch (e) {
    threw = true;
    t.ok(e instanceof TypeError);
  }
  t.equal(true, threw,
               'a.doesNotThrow with an explicit error is eating extra errors');

  // key difference is that throwing our correct error makes an assertion error
  try {
    assert.doesNotThrow(makeBlock(thrower, TypeError), TypeError);
  } catch (e) {
    threw = true;
    t.ok(e instanceof assert.AssertionError);
  }
  t.equal(true, threw,
               'a.doesNotThrow is not catching type matching errors');

  t.end();
});

test('assert.ifError', function (t) {
  t.throws(function() {assert.ifError(new Error('test error'))});
  t.doesNotThrow(function() {assert.ifError(null)});
  t.doesNotThrow(function() {assert.ifError()});

  t.end();
});

test('assert - make sure that validating using constructor really works', function (t) {
  var threw = false;
  try {
    assert.throws(
        function() {
          throw ({});
        },
        Array
    );
  } catch (e) {
    threw = true;
  }
  t.ok(threw, 'wrong constructor validation');

  t.end();
});

test('assert -  use a RegExp to validate error message', function (t) {
  t.throws(makeBlock(thrower, TypeError), /test/);

  t.end();
});

test('assert - se a fn to validate error object', function (t) {
  t.throws(makeBlock(thrower, TypeError), function(err) {
    if ((err instanceof TypeError) && /test/.test(err)) {
      return true;
    }
  });

  t.end();
});

test('assert - Make sure deepEqual doesn\'t loop forever on circular refs', function (t) {
  var b = {};
  b.b = b;

  var c = {};
  c.b = c;

  var gotError = false;
  try {
    assert.deepEqual(b, c);
  } catch (e) {
    gotError = true;
  }

  t.ok(gotError);

  t.end();
});


test('assert - test assertion message', function (t) {
  function testAssertionMessage(actual, expected) {
    try {
      assert.equal(actual, '');
    } catch (e) {
      t.equal(e.toString(),
          ['AssertionError:', expected, '==', '""'].join(' '));
    }
  }
  testAssertionMessage(undefined, '"undefined"');
  testAssertionMessage(null, 'null');
  testAssertionMessage(true, 'true');
  testAssertionMessage(false, 'false');
  testAssertionMessage(0, '0');
  testAssertionMessage(100, '100');
  testAssertionMessage(NaN, '"NaN"');
  testAssertionMessage(Infinity, '"Infinity"');
  testAssertionMessage(-Infinity, '"-Infinity"');
  testAssertionMessage('', '""');
  testAssertionMessage('foo', '"foo"');
  testAssertionMessage([], '[]');
  testAssertionMessage([1, 2, 3], '[1,2,3]');
  testAssertionMessage(/a/, '"/a/"');
  testAssertionMessage(function f() {}, '"function f() {}"');
  testAssertionMessage({}, '{}');
  testAssertionMessage({a: undefined, b: null}, '{"a":"undefined","b":null}');
  testAssertionMessage({a: NaN, b: Infinity, c: -Infinity},
      '{"a":"NaN","b":"Infinity","c":"-Infinity"}');

  t.end();
});

test('assert - regressions from node.js testcase', function (t) {
  var threw = false;

  try {
    assert.throws(function () {
      assert.ifError(null);
    });
  } catch (e) {
    threw = true;
    t.equal(e.message, 'Missing expected exception..');
  }
  t.ok(threw);

  try {
    assert.equal(1, 2);
  } catch (e) {
    t.equal(e.toString().split('\n')[0], 'AssertionError: 1 == 2');
  }

  try {
    assert.equal(1, 2, 'oh no');
  } catch (e) {
    t.equal(e.toString().split('\n')[0], 'AssertionError: oh no');
  }

  t.end();
});
