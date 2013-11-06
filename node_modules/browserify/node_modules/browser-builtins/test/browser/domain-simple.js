
var test = require('tape');

test('require domain should not throw', function (t) {
  try {
    var ret = require('domain');
    t.ok(true, 'domain did not throw');
    t.deepEqual(ret, {});
  } catch (e) {
    t.ok(false, 'domain did throw');
  }
  t.end();
});
