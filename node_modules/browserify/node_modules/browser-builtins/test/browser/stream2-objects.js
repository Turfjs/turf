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

var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var shims = require('../../builtin/_shims.js');
var test = require('tape');
var timers = require('timers');

function toArray(callback) {
  var stream = new Writable({ objectMode: true });
  var list = [];
  stream.write = function(chunk) {
    list.push(chunk);
  };

  stream.end = function() {
    callback(list);
  };

  return stream;
}

function fromArray(list) {
  var r = new Readable({ objectMode: true });
  r._read = noop;
  shims.forEach(list, function(chunk) {
    r.push(chunk);
  });
  r.push(null);

  return r;
}

function noop() {}

test('can read objects from stream', function(t) {
  var r = fromArray([{ one: '1'}, { two: '2' }]);

  var v1 = r.read();
  var v2 = r.read();
  var v3 = r.read();

  t.deepEqual(v1, { one: '1' });
  t.deepEqual(v2, { two: '2' });
  t.deepEqual(v3, null);

  t.end();
});

test('can pipe objects into stream', function(t) {
  var r = fromArray([{ one: '1'}, { two: '2' }]);

  r.pipe(toArray(function(list) {
    t.deepEqual(list, [
      { one: '1' },
      { two: '2' }
    ]);

    t.end();
  }));
});

test('read(n) is ignored', function(t) {
  var r = fromArray([{ one: '1'}, { two: '2' }]);

  var value = r.read(2);

  t.deepEqual(value, { one: '1' });

  t.end();
});

test('can read objects from _read (sync)', function(t) {
  var r = new Readable({ objectMode: true });
  var list = [{ one: '1'}, { two: '2' }];
  r._read = function(n) {
    var item = list.shift();
    r.push(item || null);
  };

  r.pipe(toArray(function(list) {
    t.deepEqual(list, [
      { one: '1' },
      { two: '2' }
    ]);

    t.end();
  }));
});

test('can read objects from _read (async)', function(t) {
  var r = new Readable({ objectMode: true });
  var list = [{ one: '1'}, { two: '2' }];
  r._read = function(n) {
    var item = list.shift();
    timers.setImmediate(function() {
      r.push(item || null);
    });
  };

  r.pipe(toArray(function(list) {
    t.deepEqual(list, [
      { one: '1' },
      { two: '2' }
    ]);

    t.end();
  }));
});

test('can read strings as objects', function(t) {
  var r = new Readable({
    objectMode: true
  });
  r._read = noop;
  var list = ['one', 'two', 'three'];
  shims.forEach(list, function(str) {
    r.push(str);
  });
  r.push(null);

  r.pipe(toArray(function(array) {
    t.deepEqual(array, list);

    t.end();
  }));
});

test('read(0) for object streams', function(t) {
  var r = new Readable({
    objectMode: true
  });
  r._read = noop;

  r.push('foobar');
  r.push(null);

  var v = r.read(0);

  r.pipe(toArray(function(array) {
    t.deepEqual(array, ['foobar']);

    t.end();
  }));
});

test('falsey values', function(t) {
  var r = new Readable({
    objectMode: true
  });
  r._read = noop;

  r.push(false);
  r.push(0);
  r.push('');
  r.push(null);

  r.pipe(toArray(function(array) {
    t.deepEqual(array, [false, 0, '']);

    t.end();
  }));
});

test('high watermark _read', function(t) {
  var r = new Readable({
    highWaterMark: 6,
    objectMode: true
  });
  var calls = 0;
  var list = ['1', '2', '3', '4', '5', '6', '7', '8'];

  r._read = function(n) {
    calls++;
  };

  shims.forEach(list, function(c) {
    r.push(c);
  });

  var v = r.read();

  t.equal(calls, 0);
  t.equal(v, '1');

  var v2 = r.read();

  t.equal(calls, 1);
  t.equal(v2, '2');

  t.end();
});

test('high watermark push', function(t) {
  var r = new Readable({
    highWaterMark: 6,
    objectMode: true
  });
  r._read = function(n) {};
  for (var i = 0; i < 6; i++) {
    var bool = r.push(i);
    t.equal(bool, i === 5 ? false : true);
  }

  t.end();
});

test('can write objects to stream', function(t) {
  var w = new Writable({ objectMode: true });

  w._write = function(chunk, encoding, cb) {
    t.deepEqual(chunk, { foo: 'bar' });
    cb();
  };

  w.on('finish', function() {
    t.end();
  });

  w.write({ foo: 'bar' });
  w.end();
});

test('can write multiple objects to stream', function(t) {
  var w = new Writable({ objectMode: true });
  var list = [];

  w._write = function(chunk, encoding, cb) {
    list.push(chunk);
    cb();
  };

  w.on('finish', function() {
    t.deepEqual(list, [0, 1, 2, 3, 4]);

    t.end();
  });

  w.write(0);
  w.write(1);
  w.write(2);
  w.write(3);
  w.write(4);
  w.end();
});

test('can write strings as objects', function(t) {
  var w = new Writable({
    objectMode: true
  });
  var list = [];

  w._write = function(chunk, encoding, cb) {
    list.push(chunk);
    timers.setImmediate(cb);
  };

  w.on('finish', function() {
    t.deepEqual(list, ['0', '1', '2', '3', '4']);

    t.end();
  });

  w.write('0');
  w.write('1');
  w.write('2');
  w.write('3');
  w.write('4');
  w.end();
});

test('buffers finish until cb is called', function(t) {
  var w = new Writable({
    objectMode: true
  });
  var called = false;

  w._write = function(chunk, encoding, cb) {
    t.equal(chunk, 'foo');

    timers.setImmediate(function() {
      called = true;
      cb();
    });
  };

  w.on('finish', function() {
    t.equal(called, true);

    t.end();
  });

  w.write('foo');
  w.end();
});
