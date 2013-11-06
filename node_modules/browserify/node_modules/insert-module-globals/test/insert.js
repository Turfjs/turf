var test = require('tap').test;
var mdeps = require('module-deps');
var bpack = require('browser-pack');
var insert = require('../');
var vm = require('vm');

test('process.nextTick inserts', function (t) {
    t.plan(4);
    var files = [ __dirname + '/insert/main.js' ];
    var s = mdeps(files)
        .pipe(insert(files))
        .pipe(bpack({ raw: true }))
    ;
    var src = '';
    s.on('data', function (buf) { src += buf });
    s.on('end', function () {
        var c = { t: t, setTimeout: setTimeout };
        vm.runInNewContext(src, c);
    });
});

test('buffer inserts', function (t) {
    t.plan(2);
    var files = [ __dirname + '/insert/buffer.js' ];
    var s = mdeps(files)
        .pipe(insert(files))
        .pipe(bpack({ raw: true }))
    ;
    var src = '';
    s.on('data', function (buf) { src += buf });
    s.on('end', function () {
        var c = { t: t, setTimeout: setTimeout };
        vm.runInNewContext(src, c);
    });
});
