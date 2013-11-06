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
var Buffer = require('buffer').Buffer;
var PassThrough = require('stream').PassThrough;
var Transform = require('stream').Transform;
var timers = require('timers');

test('writable side consumption', function(t) {
  var tx = new Transform({
    highWaterMark: 10
  });

  var transformed = 0;
  tx._transform = function(chunk, encoding, cb) {
    transformed += chunk.length;
    tx.push(chunk);
    cb();
  };

  for (var i = 1; i <= 10; i++) {
    tx.write(new Buffer(i));
  }
  tx.end();

  t.equal(tx._readableState.length, 10);
  t.equal(transformed, 10);
  t.equal(tx._transformState.writechunk.length, 5);
  t.same(shims.map(tx._writableState.buffer, function(c) {
    return c.chunk.length;
  }), [6, 7, 8, 9, 10]);

  t.end();
});

test('passthrough', function(t) {
  var pt = new PassThrough();

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));
  pt.end();

  t.equal(pt.read(5).toString(), 'foogb');
  t.equal(pt.read(5).toString(), 'arkba');
  t.equal(pt.read(5).toString(), 'zykue');
  t.equal(pt.read(5).toString(), 'l');
  t.end();
});

test('simple transform', function(t) {
  var pt = new Transform;
  pt._transform = function(c, e, cb) {
    var ret = new Buffer(c.length);
    ret.fill('x');
    pt.push(ret);
    cb();
  };

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));
  pt.end();

  t.equal(pt.read(5).toString(), 'xxxxx');
  t.equal(pt.read(5).toString(), 'xxxxx');
  t.equal(pt.read(5).toString(), 'xxxxx');
  t.equal(pt.read(5).toString(), 'x');
  t.end();
});

test('async passthrough', function(t) {
  var pt = new Transform;
  pt._transform = function(chunk, encoding, cb) {
    setTimeout(function() {
      pt.push(chunk);
      cb();
    }, 10);
  };

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));
  pt.end();

  pt.on('finish', function() {
    t.equal(pt.read(5).toString(), 'foogb');
    t.equal(pt.read(5).toString(), 'arkba');
    t.equal(pt.read(5).toString(), 'zykue');
    t.equal(pt.read(5).toString(), 'l');
    t.end();
  });
});

test('assymetric transform (expand)', function(t) {
  var pt = new Transform;

  // emit each chunk 2 times.
  pt._transform = function(chunk, encoding, cb) {
    setTimeout(function() {
      pt.push(chunk);
      setTimeout(function() {
        pt.push(chunk);
        cb();
      }, 10)
    }, 10);
  };

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));
  pt.end();

  pt.on('finish', function() {
    t.equal(pt.read(5).toString(), 'foogf');
    t.equal(pt.read(5).toString(), 'oogba');
    t.equal(pt.read(5).toString(), 'rkbar');
    t.equal(pt.read(5).toString(), 'kbazy');
    t.equal(pt.read(5).toString(), 'bazyk');
    t.equal(pt.read(5).toString(), 'uelku');
    t.equal(pt.read(5).toString(), 'el');
    t.end();
  });
});

test('assymetric transform (compress)', function(t) {
  var pt = new Transform;

  // each output is the first char of 3 consecutive chunks,
  // or whatever's left.
  pt.state = '';

  pt._transform = function(chunk, encoding, cb) {
    if (!chunk)
      chunk = '';
    var s = chunk.toString();
    setTimeout(shims.bind(function() {
      this.state += s.charAt(0);
      if (this.state.length === 3) {
        pt.push(new Buffer(this.state));
        this.state = '';
      }
      cb();
    }, this), 10);
  };

  pt._flush = function(cb) {
    // just output whatever we have.
    pt.push(new Buffer(this.state));
    this.state = '';
    cb();
  };

  pt.write(new Buffer('aaaa'));
  pt.write(new Buffer('bbbb'));
  pt.write(new Buffer('cccc'));
  pt.write(new Buffer('dddd'));
  pt.write(new Buffer('eeee'));
  pt.write(new Buffer('aaaa'));
  pt.write(new Buffer('bbbb'));
  pt.write(new Buffer('cccc'));
  pt.write(new Buffer('dddd'));
  pt.write(new Buffer('eeee'));
  pt.write(new Buffer('aaaa'));
  pt.write(new Buffer('bbbb'));
  pt.write(new Buffer('cccc'));
  pt.write(new Buffer('dddd'));
  pt.end();

  // 'abcdeabcdeabcd'
  pt.on('finish', function() {
    t.equal(pt.read(5).toString(), 'abcde');
    t.equal(pt.read(5).toString(), 'abcde');
    t.equal(pt.read(5).toString(), 'abcd');
    t.end();
  });
});

// this tests for a stall when data is written to a full stream
// that has empty transforms.
test('complex transform', function(t) {
  var count = 0;
  var saved = null;
  var pt = new Transform({highWaterMark:3});
  pt._transform = function(c, e, cb) {
    if (count++ === 1)
      saved = c;
    else {
      if (saved) {
        pt.push(saved);
        saved = null;
      }
      pt.push(c);
    }

    cb();
  };

  pt.once('readable', function() {
    timers.setImmediate(function() {
      pt.write(new Buffer('d'));
      pt.write(new Buffer('ef'), function() {
        pt.end();
        t.end();
      });
      t.equal(pt.read().toString(), 'abc');
      t.equal(pt.read().toString(), 'def');
      t.equal(pt.read(), null);
    });
  });

  pt.write(new Buffer('abc'));
});


test('passthrough event emission', function(t) {
  var pt = new PassThrough();
  var emits = 0;
  pt.on('readable', function() {
    var state = pt._readableState;
    emits++;
  });

  var i = 0;

  pt.write(new Buffer('foog'));

  pt.write(new Buffer('bark'));

  t.equal(emits, 1);

  t.equal(pt.read(5).toString(), 'foogb');
  t.equal(pt.read(5) + '', 'null');

  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));

  t.equal(emits, 2);

  t.equal(pt.read(5).toString(), 'arkba');
  t.equal(pt.read(5).toString(), 'zykue');
  t.equal(pt.read(5), null);

  pt.end();

  t.equal(emits, 3);

  t.equal(pt.read(5).toString(), 'l');
  t.equal(pt.read(5), null);

  t.equal(emits, 3);
  t.end();
});

test('passthrough event emission reordered', function(t) {
  var pt = new PassThrough;
  var emits = 0;
  pt.on('readable', function() {
    emits++;
  });

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  t.equal(emits, 1);

  t.equal(pt.read(5).toString(), 'foogb');
  t.equal(pt.read(5), null);

  pt.once('readable', function() {
    t.equal(pt.read(5).toString(), 'arkba');

    t.equal(pt.read(5), null);

    pt.once('readable', function() {
      t.equal(pt.read(5).toString(), 'zykue');
      t.equal(pt.read(5), null);
      pt.once('readable', function() {
        t.equal(pt.read(5).toString(), 'l');
        t.equal(pt.read(5), null);
        t.equal(emits, 4);
        t.end();
      });
      pt.end();
    });
    pt.write(new Buffer('kuel'));
  });

  pt.write(new Buffer('bazy'));
});

test('passthrough facaded', function(t) {
  var pt = new PassThrough;
  var datas = [];
  pt.on('data', function(chunk) {
    datas.push(chunk.toString());
  });

  pt.on('end', function() {
    t.same(datas, ['foog', 'bark', 'bazy', 'kuel']);
    t.end();
  });

  pt.write(new Buffer('foog'));
  setTimeout(function() {
    pt.write(new Buffer('bark'));
    setTimeout(function() {
      pt.write(new Buffer('bazy'));
      setTimeout(function() {
        pt.write(new Buffer('kuel'));
        setTimeout(function() {
          pt.end();
        }, 10);
      }, 10);
    }, 10);
  }, 10);
});

test('object transform (json parse)', function(t) {
  var jp = new Transform({ objectMode: true });
  jp._transform = function(data, encoding, cb) {
    try {
      jp.push(JSON.parse(data));
      cb();
    } catch (er) {
      cb(er);
    }
  };

  // anything except null/undefined is fine.
  // those are "magic" in the stream API, because they signal EOF.
  var objects = [
    { foo: 'bar' },
    100,
    "string",
    { nested: { things: [ { foo: 'bar' }, 100, "string" ] } }
  ];

  var ended = false;
  jp.on('end', function() {
    ended = true;
  });

  shims.forEach(objects, function(obj) {
    jp.write(JSON.stringify(obj));
    var res = jp.read();
    t.same(res, obj);
  });

  jp.end();

  timers.setImmediate(function() {
    t.ok(ended);
    t.end();
  })
});

test('object transform (json stringify)', function(t) {
  var js = new Transform({ objectMode: true });
  js._transform = function(data, encoding, cb) {
    try {
      js.push(JSON.stringify(data));
      cb();
    } catch (er) {
      cb(er);
    }
  };

  // anything except null/undefined is fine.
  // those are "magic" in the stream API, because they signal EOF.
  var objects = [
    { foo: 'bar' },
    100,
    "string",
    { nested: { things: [ { foo: 'bar' }, 100, "string" ] } }
  ];

  var ended = false;
  js.on('end', function() {
    ended = true;
  });

  shims.forEach(objects, function(obj) {
    js.write(obj);
    var res = js.read();
    t.equal(res, JSON.stringify(obj));
  });

  js.end();

  timers.setImmediate(function() {
    t.ok(ended);
    t.end();
  })
});
