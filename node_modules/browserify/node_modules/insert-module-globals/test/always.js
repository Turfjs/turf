var test = require('tap').test;
var mdeps = require('module-deps');
var bpack = require('browser-pack');
var insert = require('../');
var vm = require('vm');

test('always insert', function (t) {
    t.plan(6);
    var files = [ __dirname + '/always/main.js' ];
    var s = mdeps(files)
        .pipe(insert(files, { always: true }))
        .pipe(bpack({ raw: true }))
    ;
    var src = '';
    s.on('data', function (buf) { src += buf });
    s.on('end', function () {
        var c = {
            t: t,
            self: { xyz: 555 }
        };
        vm.runInNewContext(src, c);
    });
});
