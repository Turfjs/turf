// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var test = require('tape');
var shims = require('../../builtin/_shims.js');

var path = require('path');

test('path.basename', function (t) {
  t.equal(path.basename(''), '');
  t.equal(path.basename('/dir/basename.ext'), 'basename.ext');
  t.equal(path.basename('/basename.ext'), 'basename.ext');
  t.equal(path.basename('basename.ext'), 'basename.ext');
  t.equal(path.basename('basename.ext/'), 'basename.ext');
  t.equal(path.basename('basename.ext//'), 'basename.ext');

  t.equal(path.basename('\\dir\\basename.ext'), '\\dir\\basename.ext');
  t.equal(path.basename('\\basename.ext'), '\\basename.ext');
  t.equal(path.basename('basename.ext'), 'basename.ext');
  t.equal(path.basename('basename.ext\\'), 'basename.ext\\');
  t.equal(path.basename('basename.ext\\\\'), 'basename.ext\\\\');

  t.end();
});

test('path.extname', function (t) {
  t.equal(path.dirname('/a/b/'), '/a');
  t.equal(path.dirname('/a/b'), '/a');
  t.equal(path.dirname('/a'), '/');
  t.equal(path.dirname(''), '.');
  t.equal(path.dirname('/'), '/');
  t.equal(path.dirname('////'), '/');

  t.equal(path.extname(''), '');
  t.equal(path.extname('/path/to/file'), '');
  t.equal(path.extname('/path/to/file.ext'), '.ext');
  t.equal(path.extname('/path.to/file.ext'), '.ext');
  t.equal(path.extname('/path.to/file'), '');
  t.equal(path.extname('/path.to/.file'), '');
  t.equal(path.extname('/path.to/.file.ext'), '.ext');
  t.equal(path.extname('/path/to/f.ext'), '.ext');
  t.equal(path.extname('/path/to/..ext'), '.ext');
  t.equal(path.extname('file'), '');
  t.equal(path.extname('file.ext'), '.ext');
  t.equal(path.extname('.file'), '');
  t.equal(path.extname('.file.ext'), '.ext');
  t.equal(path.extname('/file'), '');
  t.equal(path.extname('/file.ext'), '.ext');
  t.equal(path.extname('/.file'), '');
  t.equal(path.extname('/.file.ext'), '.ext');
  t.equal(path.extname('.path/file.ext'), '.ext');
  t.equal(path.extname('file.ext.ext'), '.ext');
  t.equal(path.extname('file.'), '.');
  t.equal(path.extname('.'), '');
  t.equal(path.extname('./'), '');
  t.equal(path.extname('.file.ext'), '.ext');
  t.equal(path.extname('.file'), '');
  t.equal(path.extname('.file.'), '.');
  t.equal(path.extname('.file..'), '.');
  t.equal(path.extname('..'), '');
  t.equal(path.extname('../'), '');
  t.equal(path.extname('..file.ext'), '.ext');
  t.equal(path.extname('..file'), '.file');
  t.equal(path.extname('..file.'), '.');
  t.equal(path.extname('..file..'), '.');
  t.equal(path.extname('...'), '.');
  t.equal(path.extname('...ext'), '.ext');
  t.equal(path.extname('....'), '.');
  t.equal(path.extname('file.ext/'), '.ext');
  t.equal(path.extname('file.ext//'), '.ext');
  t.equal(path.extname('file/'), '');
  t.equal(path.extname('file//'), '');
  t.equal(path.extname('file./'), '.');
  t.equal(path.extname('file.//'), '.');

  t.equal(path.extname('.\\'), '');
  t.equal(path.extname('..\\'), '.\\');
  t.equal(path.extname('file.ext\\'), '.ext\\');
  t.equal(path.extname('file.ext\\\\'), '.ext\\\\');
  t.equal(path.extname('file\\'), '');
  t.equal(path.extname('file\\\\'), '');
  t.equal(path.extname('file.\\'), '.\\');
  t.equal(path.extname('file.\\\\'), '.\\\\');

  t.end();
});

test('path.join', function (t) {
  var joinTests =
      // arguments                     result
      [[['.', 'x/b', '..', '/b/c.js'], 'x/b/c.js'],
       [['/.', 'x/b', '..', '/b/c.js'], '/x/b/c.js'],
       [['/foo', '../../../bar'], '/bar'],
       [['foo', '../../../bar'], '../../bar'],
       [['foo/', '../../../bar'], '../../bar'],
       [['foo/x', '../../../bar'], '../bar'],
       [['foo/x', './bar'], 'foo/x/bar'],
       [['foo/x/', './bar'], 'foo/x/bar'],
       [['foo/x/', '.', 'bar'], 'foo/x/bar'],
       [['./'], './'],
       [['.', './'], './'],
       [['.', '.', '.'], '.'],
       [['.', './', '.'], '.'],
       [['.', '/./', '.'], '.'],
       [['.', '/////./', '.'], '.'],
       [['.'], '.'],
       [['', '.'], '.'],
       [['', 'foo'], 'foo'],
       [['foo', '/bar'], 'foo/bar'],
       [['', '/foo'], '/foo'],
       [['', '', '/foo'], '/foo'],
       [['', '', 'foo'], 'foo'],
       [['foo', ''], 'foo'],
       [['foo/', ''], 'foo/'],
       [['foo', '', '/bar'], 'foo/bar'],
       [['./', '..', '/foo'], '../foo'],
       [['./', '..', '..', '/foo'], '../../foo'],
       [['.', '..', '..', '/foo'], '../../foo'],
       [['', '..', '..', '/foo'], '../../foo'],
       [['/'], '/'],
       [['/', '.'], '/'],
       [['/', '..'], '/'],
       [['/', '..', '..'], '/'],
       [[''], '.'],
       [['', ''], '.'],
       [[' /foo'], ' /foo'],
       [[' ', 'foo'], ' /foo'],
       [[' ', '.'], ' '],
       [[' ', '/'], ' /'],
       [[' ', ''], ' '],
       [['/', 'foo'], '/foo'],
       [['/', '/foo'], '/foo'],
       [['/', '//foo'], '/foo'],
       [['/', '', '/foo'], '/foo'],
       [['', '/', 'foo'], '/foo'],
       [['', '/', '/foo'], '/foo']
      ];

  // Run the join tests.
  shims.forEach(joinTests, function(test) {
    var actual = path.join.apply(path, test[0]);
    var expected = test[1];
    t.equal(actual, expected);
  });

  var joinThrowTests = [true, false, 7, null, {}, undefined, [], NaN];
  shims.forEach(joinThrowTests, function(test) {
    t.throws(function() {
      path.join(test);
    }, TypeError);
    t.throws(function() {
      path.resolve(test);
    }, TypeError);
  });

  t.end();
});

test('path.normalize', function (t) {
  t.equal(path.normalize('./fixtures///b/../b/c.js'),
               'fixtures/b/c.js');
  t.equal(path.normalize('/foo/../../../bar'), '/bar');
  t.equal(path.normalize('a//b//../b'), 'a/b');
  t.equal(path.normalize('a//b//./c'), 'a/b/c');
  t.equal(path.normalize('a//b//.'), 'a/b');

  t.end();
});

test('path.resolve', function (t) {
  var resolveTests =
      // arguments                                    result
      [[['/var/lib', '../', 'file/'], '/var/file'],
       [['/var/lib', '/../', 'file/'], '/file'],
       [['/some/dir', '.', '/absolute/'], '/absolute']];

  shims.forEach(resolveTests, function(test) {
    var actual = path.resolve.apply(path, test[0]);
    var expected = test[1];
    t.equal(actual, expected);
  });

  t.end();
});

test('path.isAbsolute', function (t) {
  t.equal(path.isAbsolute('/home/foo'), true);
  t.equal(path.isAbsolute('/home/foo/..'), true);
  t.equal(path.isAbsolute('bar/'), false);
  t.equal(path.isAbsolute('./baz'), false);

  t.end();
});

test('path.relative', function (t) {
  var relativeTests =
      // arguments                    result
      [['/var/lib', '/var', '..'],
       ['/var/lib', '/bin', '../../bin'],
       ['/var/lib', '/var/lib', ''],
       ['/var/lib', '/var/apache', '../apache'],
       ['/var/', '/var/lib', 'lib'],
       ['/', '/var/lib', 'var/lib']];

  shims.forEach(relativeTests, function(test) {
    var actual = path.relative(test[0], test[1]);
    var expected = test[2];
    t.equal(actual, expected);
  });

  t.end();
});

test('path.sep', function (t) {
  t.equal(path.sep, '/');

  t.end();
});

test('path.delimiter', function (t) {
  t.equal(path.delimiter, ':');

  t.end();
});
