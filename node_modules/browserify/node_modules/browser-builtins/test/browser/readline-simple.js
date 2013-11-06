
var test = require('tape');

test('require readline should not throw', function (t) {
  try {
    var ret = require('readline');
    t.ok(true, 'readline did not throw');
    t.deepEqual(ret, {});
  } catch (e) {
    t.ok(false, 'readline did throw');
  }
  t.end();
});
