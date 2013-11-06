
var test = require('tape');

test('require tls should not throw', function (t) {
  try {
    var ret = require('tls');
    t.ok(true, 'tls did not throw');
    t.deepEqual(ret, {});
  } catch (e) {
    t.ok(false, 'tls did throw');
  }
  t.end();
});
