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
var Buffer = require('buffer').Buffer;
var Readable = require('stream').Readable;

test('stream2 - large read stall', function (t) {
  // If everything aligns so that you do a read(n) of exactly the
  // remaining buffer, then make sure that 'end' still emits.

  var READSIZE = 100;
  var PUSHSIZE = 20;
  var PUSHCOUNT = 1000;
  var HWM = 50;

  var r = new Readable({
    highWaterMark: HWM
  });
  var rs = r._readableState;

  r._read = push;

  r.on('readable', function() {
    do {
      var ret = r.read(READSIZE);
    } while (ret && ret.length === READSIZE);
  });

  var endEmitted = false;
  r.on('end', function() {
    endEmitted = true;
  });

  var pushes = 0;
  function push() {
    if (pushes > PUSHCOUNT)
      return;

    if (pushes++ === PUSHCOUNT) {
      return r.push(null);
    }

    if (r.push(new Buffer(PUSHSIZE)))
      setTimeout(push);
  }

  // start the flow
  var ret = r.read(0);

  function done() {
    t.equal(pushes, PUSHCOUNT + 1);
    t.ok(endEmitted);
    t.end();
  }
  r.on('end', done);
});
