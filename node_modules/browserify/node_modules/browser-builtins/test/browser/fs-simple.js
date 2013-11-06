
var test = require('tape');

test('require fs should not throw', function (t) {
  try {
    var ret = require('fs');
    t.ok(true, 'fs did not throw');
    t.deepEqual(ret, {});
  } catch (e) {
    t.ok(false, 'fs did throw');
  }
  t.end();
});
