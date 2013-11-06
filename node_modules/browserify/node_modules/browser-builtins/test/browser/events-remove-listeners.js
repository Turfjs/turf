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

var events = require('events');

var count = 0;

function listener1() {
  count++;
}

function listener2() {
  count++;
}

function listener3() {
  count++;
}

test('removeListener emits and listeners array becomes empty', function (t) {
  var e1 = new events.EventEmitter();

  var emitted = false;
  e1.on('hello', listener1);
  e1.on('removeListener', function(name, cb) {
    t.equal(name, 'hello');
    t.equal(cb, listener1);
    emitted = true;
  });

  e1.removeListener('hello', listener1);
  t.deepEqual([], e1.listeners('hello'));

  t.ok(emitted, 'removeListener did fire');
  t.end();
});

test('removeing inactive handler dose nothing', function (t) {
  var e2 = new events.EventEmitter();

  var emitted = false;
  e2.on('hello', listener1);
  e2.on('removeListener', function () {
    emitted = true;
  });
  e2.removeListener('hello', listener2);
  t.deepEqual([listener1], e2.listeners('hello'));

  t.ok(!emitted, 'removeListener did not fire');
  t.end();
});

test('removeListener only removes one handler', function (t) {
  var e3 = new events.EventEmitter();

  var emitted = false;
  e3.on('hello', listener1);
  e3.on('hello', listener2);
  e3.on('removeListener', function(name, cb) {
    emitted = true;
    t.equal(name, 'hello');
    t.equal(cb, listener1);
  });
  e3.removeListener('hello', listener1);
  t.deepEqual([listener2], e3.listeners('hello'));

  t.ok(emitted, 'removeListener did fired');
  t.end();
});

test('regression: removing listener with in removeListener', function (t) {
  var e4 = new events.EventEmitter();

  function remove1() { t.ok(false); }
  function remove2() { t.ok(false); }

  var fired = 0;
  e4.on('removeListener', function(name, cb) {
    fired += 1;
    if (cb !== remove1) return;
    this.removeListener('quux', remove2);
    this.emit('quux');
  });
  e4.on('quux', remove1);
  e4.on('quux', remove2);
  e4.removeListener('quux', remove1);

  t.equal(fired, 2);
  t.end();
});
