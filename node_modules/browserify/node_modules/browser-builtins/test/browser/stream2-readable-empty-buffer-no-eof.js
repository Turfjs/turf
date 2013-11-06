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
var timers = require('timers');
var Buffer = require('buffer').Buffer;
var Readable = require('stream').Readable;

test('steam2 - readable empty buffer to eof - 1', function (t) {
  var r = new Readable();

  // should not end when we get a Buffer(0) or '' as the _read result
  // that just means that there is *temporarily* no data, but to go
  // ahead and try again later.
  //
  // note that this is very unusual.  it only works for crypto streams
  // because the other side of the stream will call read(0) to cycle
  // data through openssl.  that's why we set the timeouts to call
  // r.read(0) again later, otherwise there is no more work being done
  // and the process just exits.

  var buf = new Buffer(5);
  buf.fill('x');
  var reads = 5;
  r._read = function(n) {
    switch (reads--) {
      case 0:
        return r.push(null); // EOF
      case 1:
        return r.push(buf);
      case 2:
        setTimeout(shims.bind(r.read, r, 0), 10);
        return r.push(new Buffer(0)); // Not-EOF!
      case 3:
        setTimeout(shims.bind(r.read, r, 0), 10);
        return timers.setImmediate(function() {
          return r.push(new Buffer(0));
        });
      case 4:
        setTimeout(shims.bind(r.read, r, 0), 10);
        return setTimeout(function() {
          return r.push(new Buffer(0));
        });
      case 5:
        return setTimeout(function() {
          return r.push(buf);
        });
      default:
        throw new Error('unreachable');
    }
  };

  var results = [];
  function flow() {
    var chunk;
    while (null !== (chunk = r.read()))
      results.push(chunk + '');
  }
  r.on('readable', flow);
  r.on('end', function() {
    results.push('EOF');
  });
  flow();

  function done() {
    t.deepEqual(results, [ 'xxxxx', 'xxxxx', 'EOF' ]);
    t.end();
  }
  r.on('end', done);
});

test('steam2 - readable empty buffer to eof - 2', function (t) {
  var r = new Readable({ encoding: 'base64' });
  var reads = 5;
  r._read = function(n) {
    if (!reads--)
      return r.push(null); // EOF
    else
      return r.push(new Buffer('x'));
  };

  var results = [];
  function flow() {
    var chunk;
    while (null !== (chunk = r.read()))
      results.push(chunk + '');
  }
  r.on('readable', flow);
  r.on('end', function() {
    results.push('EOF');
  });
  flow();

  function done() {
    t.deepEqual(results, [ 'eHh4', 'eHg=', 'EOF' ]);
    t.end();
  }
  r.on('end', done);
});
