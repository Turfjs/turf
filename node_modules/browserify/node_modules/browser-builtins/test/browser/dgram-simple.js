
var test = require('tape');

test('require dgram should not throw', function (t) {
  try {
    var ret = require('dgram');
    t.ok(true, 'dgram did not throw');
    t.deepEqual(ret, {});
  } catch (e) {
    t.ok(false, 'dgram did throw');
  }
  t.end();
});
