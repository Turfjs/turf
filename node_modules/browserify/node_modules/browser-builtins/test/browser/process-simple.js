
var test = require('tape');
var process = require('process');

test('process.nextTick works', function (t) {
  process.nextTick(function () {
    t.end();
  });
});

test('process.title is browser', function (t) {
  t.equal(process.title, 'browser');
  t.end();
});

test('process.env is an empty object', function (t) {
  t.deepEqual(process.env, {});
  t.end();
});

test('process.argv is an empty array', function (t) {
  t.deepEqual(process.argv, []);
  t.end();
});

test('process.binding generally throws', function (t) {
  try {
    process.binding('throw please');
  } catch (e) {
    t.equal(e.message, 'No such module. (Possibly not yet loaded)');
    t.end();
  }
});

test('process.cwd returns /', function (t) {
  t.equal(process.cwd(), '/');
  t.end();
});
