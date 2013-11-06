
var test = require('tape');

test('require repl should not throw', function (t) {
  try {
    var ret = require('repl');
    t.ok(true, 'repl did not throw');
    t.deepEqual(ret, {});
  } catch (e) {
    t.ok(false, 'repl did throw');
  }
  t.end();
});
