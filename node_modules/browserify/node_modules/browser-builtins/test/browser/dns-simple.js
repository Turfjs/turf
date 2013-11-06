
var test = require('tape');

test('require dns should not throw', function (t) {
  try {
    var ret = require('dns');
    t.ok(true, 'dns did not throw');
    t.deepEqual(ret, {});
  } catch (e) {
    t.ok(false, 'dns did throw');
  }
  t.end();
});
