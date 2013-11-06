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
var Readable = require('stream').Readable;
var Buffer = require('buffer').Buffer;

// this test verifies that passing a huge number to read(size)
// will push up the highWaterMark, and cause the stream to read
// more data continuously, but without triggering a nextTick
// warning or RangeError.

test('stream - readable flow recursion', function (t) {

  var stream = new Readable({ highWaterMark: 2 });
  var reads = 0;
  var total = 5000;
  stream._read = function(size) {
    reads++;
    size = Math.min(size, total);
    total -= size;
    if (size === 0)
      stream.push(null);
    else
      stream.push(new Buffer(size));
  };

  var depth = 0;

  function flow(stream, size, callback) {
    depth += 1;
    var chunk = stream.read(size);

    if (!chunk)
      stream.once('readable', flow.bind(null, stream, size, callback));
    else
      callback(chunk);

    depth -= 1;
  }

  flow(stream, 5000, function() { });

  stream.on('end', function() {
    t.equal(reads, 2);
    // we pushed up the high water mark
    t.equal(stream._readableState.highWaterMark, 8192);
    // length is 0 right now, because we pulled it all out.
    t.equal(stream._readableState.length, 0);
    t.equal(depth, 0);
    t.end();
  });
});
