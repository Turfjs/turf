
var test = require('tape');

test('require cluster should not throw', function (t) {
  try {
    var ret = require('cluster');
    t.ok(true, 'cluster did not throw');
    t.deepEqual(ret, {});
  } catch (e) {
    t.ok(false, 'cluster did throw');
  }
  t.end();
});
