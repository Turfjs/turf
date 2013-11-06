
var test = require('tape');

var tty = require('tty');

test('tty.isatty return false', function (t) {
  t.equal(tty.isatty(), false);
  t.end();
});

test('tty.ReadStream', function (t) {
  try {
    new tty.ReadStream();
    t.ok(false, 'tty.ReadStream did not throw');
  } catch (e) {
    t.ok(true, 'tty.ReadStream did throw');
  }
  t.end();
});

test('tty.WriteStream', function (t) {
  try {
    new tty.WriteStream();
    t.ok(false, 'tty.WriteStream did not throw');
  } catch (e) {
    t.ok(true, 'tty.WriteStream did throw');
  }
  t.end();
});
