var test = require('tape');
var pack = require('../');

function decode(base64) {
    return new Buffer(base64, 'base64').toString();
} 

function grabSourceMap(lastLine) {
    var base64 = lastLine.split(',').pop();
    return JSON.parse(decode(base64));
}

function grabLastLine(src) {
    return src.split('\n').pop();
}

test('pack one file with source file field and one without', function (t) {
    t.plan(7);
    
    var p = pack();
    var src = '';
    p.on('data', function (buf) { src += buf });
    p.on('end', function () {
        var r = Function(['T'], 'return ' + src)(t);
        t.equal(r('xyz')(5), 555);
        t.equal(r('xyz')(5), 555);

        var lastLine = grabLastLine(src);
        var sm = grabSourceMap(lastLine);

        t.ok(/^\/\/@ sourceMappingURL/.test(lastLine), 'contains source mapping url as last line');
        t.deepEqual(sm.sources, [ 'foo.js' ], 'includes mappings for sourceFile only');
        t.equal(sm.mappings, ';;;AAAA;AACA;AACA;AACA', 'adds offset mapping for each line' );
    });
    
    p.end(JSON.stringify([
        {
            id: 'abc',
            source: 'T.equal(require("./xyz")(3), 333)',
            entry: true,
            deps: { './xyz': 'xyz' }
        },
        {
            id: 'xyz',
            source: 'T.ok(true);\nmodule.exports=function(n){\n return n*111 \n}',
            sourceFile: 'foo.js'
        }
    ]));
});

test('pack two files with source file field', function (t) {
    t.plan(7);
    
    var p = pack();
    var src = '';
    p.on('data', function (buf) { src += buf });
    p.on('end', function () {
        var r = Function(['T'], 'return ' + src)(t);
        t.equal(r('xyz')(5), 555);
        t.equal(r('xyz')(5), 555);

        var lastLine = grabLastLine(src);
        var sm = grabSourceMap(lastLine);

        t.ok(/^\/\/@ sourceMappingURL/.test(lastLine), 'contains source mapping url as last line');
        t.deepEqual(sm.sources, [ 'wunder/bar.js', 'foo.js' ], 'includes mappings for both files');
        t.equal(sm.mappings, ';AAAA;;ACAA;AACA;AACA;AACA', 'adds offset mapping for each line' );
    });
    
    p.end(JSON.stringify([
        {
            id: 'abc',
            source: 'T.equal(require("./xyz")(3), 333)',
            entry: true,
            deps: { './xyz': 'xyz' },
            sourceFile: 'wunder/bar.js'
        },
        {
            id: 'xyz',
            source: 'T.ok(true);\nmodule.exports=function(n){\n return n*111 \n}',
            sourceFile: 'foo.js'
        }
    ]));
});

test('pack two files without source file field', function (t) {
    t.plan(5);
    
    var p = pack();
    var src = '';
    p.on('data', function (buf) { src += buf });
    p.on('end', function () {
        var r = Function(['T'], 'return ' + src)(t);
        t.equal(r('xyz')(5), 555);
        t.equal(r('xyz')(5), 555);

        var lastLine = grabLastLine(src); 
        t.notOk(/^\/\/@ sourceMappingURL/.test(lastLine), 'contains no source mapping url');
    });
    
    p.end(JSON.stringify([
        {
            id: 'abc',
            source: 'T.equal(require("./xyz")(3), 333)',
            entry: true,
            deps: { './xyz': 'xyz' }
        },
        {
            id: 'xyz',
            source: 'T.ok(true);\nmodule.exports=function(n){\n return n*111 \n}'
        }
    ]));
});

test('pack two files with source file field, one with nomap flag', function (t) {
    t.plan(7);
    
    var p = pack();
    var src = '';
    p.on('data', function (buf) { src += buf });
    p.on('end', function () {
        var r = Function(['T'], 'return ' + src)(t);
        t.equal(r('xyz')(5), 555);
        t.equal(r('xyz')(5), 555);

        var lastLine = grabLastLine(src);
        var sm = grabSourceMap(lastLine);

        t.ok(/^\/\/@ sourceMappingURL/.test(lastLine), 'contains source mapping url as last line');
        t.deepEqual(sm.sources, [ 'wunder/bar.js' ], 'includes mappings for only the file without the "nomap" flag');
        t.equal(sm.mappings, ';AAAA', 'adds offset mapping for each line of mapped file' );
        t.end()
    });
    
    p.end(JSON.stringify([
        {
            id: 'abc',
            source: 'T.equal(require("./xyz")(3), 333)',
            entry: true,
            deps: { './xyz': 'xyz' },
            sourceFile: 'wunder/bar.js'
        },
        {
            id: 'xyz',
            source: 'T.ok(true);\nmodule.exports=function(n){\n return n*111 \n}',
            sourceFile: 'foo.js',
            nomap: true
        }
    ]));
});
