
var test = require('tape');

test('require net should not throw', function (t) {
  try {
    var ret = require('net');
    t.ok(true, 'net did not throw');
    t.deepEqual(ret, {});
  } catch (e) {
    t.ok(false, 'net did throw');
  }
  t.end();
});
