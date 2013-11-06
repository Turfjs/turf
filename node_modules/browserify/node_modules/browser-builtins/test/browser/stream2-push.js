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
var Readable = stream.Readable;
var Writable = stream.Writable;
var test = require('tape');
var timers = require('timers');

var EE = require('events').EventEmitter;

test('stream2 - push', function (t) {
  // a mock thing a bit like the net.Socket/tcp_wrap.handle interaction

  var stream = new Readable({
    highWaterMark: 16,
    encoding: 'utf8'
  });

  var source = new EE;

  stream._read = function() {
    readStart();
  };

  var ended = false;
  stream.on('end', function() {
    ended = true;
  });

  source.on('data', function(chunk) {
    var ret = stream.push(chunk);
    if (!ret)
      readStop();
  });

  source.on('end', function() {
    stream.push(null);
  });

  var reading = false;

  function readStart() {
    reading = true;
  }

  function readStop() {
    reading = false;
    timers.setImmediate(function() {
      var r = stream.read();
      if (r !== null)
        writer.write(r);
    });
  }

  var writer = new Writable({
    decodeStrings: false
  });

  var written = [];

  var expectWritten =
    [ 'asdfgasdfgasdfgasdfg',
      'asdfgasdfgasdfgasdfg',
      'asdfgasdfgasdfgasdfg',
      'asdfgasdfgasdfgasdfg',
      'asdfgasdfgasdfgasdfg',
      'asdfgasdfgasdfgasdfg' ];

  writer._write = function(chunk, encoding, cb) {
    written.push(chunk);
    timers.setImmediate(cb);
  };

  writer.on('finish', finish);


  // now emit some chunks.

  var chunk = "asdfg";

  var set = 0;
  readStart();
  data();
  function data() {
    t.ok(reading, 'reading 1');
    source.emit('data', chunk);
    t.ok(reading, 'reading 2');
    source.emit('data', chunk);
    t.ok(reading, 'reading 3');
    source.emit('data', chunk);
    t.ok(reading, 'reading 4');
    source.emit('data', chunk);
    t.ok(!reading, 'not reading 5');
    if (set++ < 5)
      setTimeout(data, 100);
    else
      end();
  }

  function finish() {
    t.deepEqual(written, expectWritten);
  }

  function end() {
    source.emit('end');
    t.ok(!reading, 'not reading end');
    writer.end(stream.read());
    setTimeout(function() {
      t.ok(ended, 'end emitted');
      t.end();
    }, 100);
  }
});