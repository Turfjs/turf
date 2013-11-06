
var test = require('tape');

var timers = require('timers');

test('timers.setTimeout - no clear', function (t) {
  timers.setTimeout(function () {
    t.ok(true, 'callback called');
    t.end();
  }, 1);
});

test('timers.setTimeout - clear', function (t) {
  var id = timers.setTimeout(function () {
    t.ok(false, 'callback called');
  }, 1);
  clearTimeout(id);
  t.end();
});

test('timers.setInterval - no clear', function (t) {
  var id = timers.setInterval(function () {
    timers.clearInterval(id);
    t.ok(true, 'callback called');
    t.end();
  }, 1);
});

test('timers.setInterval - clear', function (t) {
  var id = timers.setInterval(function () {
    t.ok(false, 'callback called');
  }, 1);
  timers.clearInterval(id);
  t.end();
});

test('timers.setImmediate - is async', function (t) {
  var sync = true;
  timers.setImmediate(function () {
    t.ok(!sync, 'setImmediate is async');
    t.end();
  });
  sync = false;
});

test('timers.setImmediate - no clear', function (t) {
  var aCalled = 0, bCalled = 0;
  timers.setImmediate(function () {
    aCalled += 1;
    if (aCalled && bCalled) done();
  });
  timers.setImmediate(function () {
    bCalled += 1;
    if (aCalled && bCalled) done();
  });

  function done() {
    t.equal(aCalled, 1);
    t.equal(bCalled, 1);
    t.end();
  }
});

test('timers.setImmediate - clear', function (t) {
  var aId = timers.setImmediate(function () {
    t.ok(false, 'callback called');
  });
  var bId = timers.setImmediate(function () {
    t.ok(false, 'callback called');
  });
  timers.clearImmediate(aId);
  timers.clearImmediate(bId);
  t.end();
});
