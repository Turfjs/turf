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

var stream = require('stream');

var test = require('tape');
var util = require('util');

test('stream - pipe cleanup', function (t) {
  function Writable() {
    this.writable = true;
    this.endCalls = 0;
    stream.Stream.call(this);
  }
  util.inherits(Writable, stream.Stream);
  Writable.prototype.end = function() {
    this.endCalls++;
  };

  Writable.prototype.destroy = function() {
    this.endCalls++;
  };

  function Readable() {
    this.readable = true;
    stream.Stream.call(this);
  }
  util.inherits(Readable, stream.Stream);

  function Duplex() {
    this.readable = true;
    Writable.call(this);
  }
  util.inherits(Duplex, Writable);

  var i = 0;
  var limit = 100;

  var w = new Writable();

  var r;

  for (i = 0; i < limit; i++) {
    r = new Readable();
    r.pipe(w);
    r.emit('end');
  }
  t.equal(0, r.listeners('end').length);
  t.equal(limit, w.endCalls);

  w.endCalls = 0;

  for (i = 0; i < limit; i++) {
    r = new Readable();
    r.pipe(w);
    r.emit('close');
  }
  t.equal(0, r.listeners('close').length);
  t.equal(limit, w.endCalls);

  w.endCalls = 0;

  r = new Readable();

  for (i = 0; i < limit; i++) {
    w = new Writable();
    r.pipe(w);
    w.emit('close');
  }
  t.equal(0, w.listeners('close').length);

  r = new Readable();
  w = new Writable();
  var d = new Duplex();
  r.pipe(d); // pipeline A
  d.pipe(w); // pipeline B
  t.equal(r.listeners('end').length, 2);   // A.onend, A.cleanup
  t.equal(r.listeners('close').length, 2); // A.onclose, A.cleanup
  t.equal(d.listeners('end').length, 2);   // B.onend, B.cleanup
  t.equal(d.listeners('close').length, 3); // A.cleanup, B.onclose, B.cleanup
  t.equal(w.listeners('end').length, 0);
  t.equal(w.listeners('close').length, 1); // B.cleanup

  r.emit('end');
  t.equal(d.endCalls, 1);
  t.equal(w.endCalls, 0);
  t.equal(r.listeners('end').length, 0);
  t.equal(r.listeners('close').length, 0);
  t.equal(d.listeners('end').length, 2);   // B.onend, B.cleanup
  t.equal(d.listeners('close').length, 2); // B.onclose, B.cleanup
  t.equal(w.listeners('end').length, 0);
  t.equal(w.listeners('close').length, 1); // B.cleanup

  d.emit('end');
  t.equal(d.endCalls, 1);
  t.equal(w.endCalls, 1);
  t.equal(r.listeners('end').length, 0);
  t.equal(r.listeners('close').length, 0);
  t.equal(d.listeners('end').length, 0);
  t.equal(d.listeners('close').length, 0);
  t.equal(w.listeners('end').length, 0);
  t.equal(w.listeners('close').length, 0);

  t.end();
});
