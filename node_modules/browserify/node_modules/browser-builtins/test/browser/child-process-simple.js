
var test = require('tape');

test('require child_process should not throw', function (t) {
  try {
    var ret = require('child_process');
    t.ok(true, 'child_process did not throw');
    t.deepEqual(ret, {});
  } catch (e) {
    t.ok(false, 'child_process did throw');
  }
  t.end();
});
