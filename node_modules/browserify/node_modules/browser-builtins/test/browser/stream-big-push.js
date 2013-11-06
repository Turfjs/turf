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

var stream = require('stream');
var str = 'asdfasdfasdfasdfasdf';

test('stream.Readable - big push', function (t) {
  var r = new stream.Readable({
    highWaterMark: 5,
    encoding: 'utf8'
  });

  var reads = 0;
  var eofed = false;
  var ended = false;

  r._read = function(n) {
    if (reads === 0) {
      setTimeout(function() {
        r.push(str);
      });
      reads++;
    } else if (reads === 1) {
      var ret = r.push(str);
      t.equal(ret, false);
      reads++;
    } else {
      t.ok(!eofed);
      eofed = true;
      r.push(null);
    }
  };

  r.on('end', function() {
    ended = true;
    done();
  });

  // push some data in to start.
  // we've never gotten any read event at this point.
  var ret = r.push(str);
  // should be false.  > hwm
  t.ok(!ret);
  var chunk = r.read();
  t.equal(chunk, str);
  chunk = r.read();
  t.equal(chunk, null);

  r.once('readable', function() {
    // this time, we'll get *all* the remaining data, because
    // it's been added synchronously, as the read WOULD take
    // us below the hwm, and so it triggered a _read() again,
    // which synchronously added more, which we then return.
    chunk = r.read();
    t.equal(chunk, str + str);

    chunk = r.read();
    t.equal(chunk, null);
  });

  function done() {
    t.ok(eofed);
    t.ok(ended);
    t.equal(reads, 2);
    t.end();
  }
});
