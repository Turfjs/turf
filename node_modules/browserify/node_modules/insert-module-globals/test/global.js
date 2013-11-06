var test = require('tap').test;
var vm = require('vm');

var insert = require('../');
var bpack = require('browser-pack');
var mdeps = require('module-deps');

test('insert globals', function (t) {
    t.plan(2);
    
    var files = [ __dirname + '/global/main.js' ];
    var deps = mdeps(files);
    var ins = insert(files);
    var pack = bpack({ raw: true });
    
    deps.pipe(ins).pipe(pack);
    
    var src = '';
    pack.on('data', function (buf) { src += buf });
    pack.on('end', function () {
        var c = {
            t : t,
            a : 555,
        };
        c.self = c;
        vm.runInNewContext(src, c);
    });
});

test('__filename and __dirname', function (t) {
    t.plan(2);
    
    var files = [ __dirname + '/global/filename.js' ];
    var deps = mdeps(files);
    var ins = insert(files);
    var pack = bpack({ raw: true });
    
    deps.pipe(ins).pipe(pack);
    
    var src = '';
    pack.on('data', function (buf) { src += buf });
    pack.on('end', function () {
        var c = {};
        vm.runInNewContext('require=' + src, c);
        var x = c.require(files[0]);
        t.equal(x.filename, '/filename.js');
        t.equal(x.dirname, '/');
    });
});
