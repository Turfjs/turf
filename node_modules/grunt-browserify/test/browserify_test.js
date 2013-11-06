'use strict';

var grunt = require('grunt');
var vm = require('vm');
var browserify = require('browserify');
var jsdom = require('jsdom').jsdom;

function readFile(path) {
  return grunt.file.read(path);
}

function compareOutputs(fn1, fn2) {
  return (grunt.util.normalizelf(fn1.toString()) === grunt.util.normalizelf(fn2.toString()));
}

function moduleExported(context, modulePath, extension) {
  var module = modulePath.match(/(\w+)\.js/)[1];
  return compareOutputs(context.exports[module], require(modulePath));
}

function moduleNotExported(context, modulePath) {
  return !moduleExported(context, modulePath);
}

function getIncludedModules(file, context) {
  var c = context || {};
  var actual = readFile(file);
  c.required = function (exports) {
    c.exports = exports;
  };
  vm.runInNewContext(actual, c);
  return c;
}

function domWindow() {
  var html =
    '<!DOCTYPE html>' +
    '<html>' +
      '<head>' +
        '<title>Test</title>' +
      '</head>' +
      '<body>' +
      '</body>' +
    '</html>';
  var window =  jsdom(html).createWindow();
  var context = vm.createContext(window);
  Object.keys(window).forEach(function (k) {
    context[k] = window[k];
  });
  return context;
}

module.exports = {
  basic: function (test) {
    test.expect(2);
    var context = getIncludedModules('tmp/basic.js');

    test.ok(moduleExported(context, './fixtures/basic/a.js'));
    test.ok(moduleExported(context, './fixtures/basic/b.js'));

    test.done();
  },

  ignores: function (test) {
    test.expect(3);

    var context = getIncludedModules('tmp/ignores.js');

    test.ok(moduleExported(context, './fixtures/ignore/a.js'));
    test.ok(moduleExported(context, './fixtures/ignore/b.js'));
    test.ok(moduleNotExported(context, './fixtures/ignore/ignore.js'));

    test.done();
  },

  alias: function (test) {
    test.expect(1);

    var context = getIncludedModules('tmp/alias.js');
    var aliasedFile = require('./fixtures/alias/toBeAliased.js');

    test.ok(compareOutputs(context.exports.alias, aliasedFile));

    test.done();
  },

  aliasString: function (test) {
    test.expect(1);

    var context = getIncludedModules('tmp/aliasString.js');
    var aliasedFile = require('./fixtures/alias/toBeAliased.js');

    test.ok(compareOutputs(context.exports.alias, aliasedFile));

    test.done();
  },

  aliasMappings: function (test) {
    test.expect(4);

    var context = getIncludedModules('tmp/aliasMappings.js');
    var rootFile = require('./fixtures/aliasMappings/root.js');
    var fooFile = require('./fixtures/aliasMappings/foo/foo.js');
    var fooBarFile = require('./fixtures/aliasMappings/foo/bar/foobar.js');

    test.ok(compareOutputs(context.exports.root, rootFile));
    test.ok(compareOutputs(context.exports.foo, fooFile));
    test.ok(compareOutputs(context.exports.foobar, fooBarFile));
    test.ok(compareOutputs(context.exports.otherbar, fooBarFile));

    test.done();
  },

  external: function (test) {
    test.expect(5);

    var actual = readFile('tmp/external.js');
    var core = browserify();
    core.require(__dirname + '/fixtures/external/a.js');
    core.require(__dirname + '/fixtures/external/alias.js', {expose: 'vendor/alias'});
    core.require('events');

    core.bundle(function (err, src) {
      var c = {
        required: function (exports) {
          c.exports = exports;
        }
      };
      vm.runInNewContext(src, c);
      vm.runInNewContext(actual, c);

      test.ok(moduleExported(c, './fixtures/external/a.js'));
      test.ok(moduleExported(c, './fixtures/external/b.js'));

      //make sure a.js contents aren't in the bundle
      test.ok(!actual.match('this should be a common require'));

      //make sure vendor/alias contents aren't in the bundle
      test.ok(!actual.match('vendor/alias should be a common require'));

      //make sure events module isn't included
      test.ok(!actual.match('EventEmitter'));


      test.done();
    });
  },

  externalDir: function (test) {
    test.expect(2);

    var actual = readFile('tmp/external-dir.js');
    var core = browserify();
    core.require(__dirname + '/fixtures/external-dir/b');

    core.bundle(function (err, src) {
      var c = {
        required: function (exports) {
          c.exports = exports;
        }
      };

      vm.runInNewContext(src, c);
      vm.runInNewContext(actual, c);

      test.ok(moduleExported(c, './fixtures/external-dir/a.js'));

      //make sure b directory contents aren't in the bundle
      test.ok(!actual.match('this should be a common module require'));

      test.done();
    });
  },

  externalize: function (test) {
    test.expect(4);

    var actual = readFile('tmp/externalize.js');
    var c = {};
    vm.runInNewContext(actual, c);


    var depen = browserify();
    depen.external(__dirname + '/fixtures/externalize/a.js');
    depen.add(__dirname + '/fixtures/externalize/entry.js');

    depen.bundle(function (err, src) {
      c.required = function (exports) {
        c.exports = exports;
      };
      vm.runInNewContext(src, c);

      test.ok(moduleExported(c, './fixtures/externalize/a.js'));
      test.ok(moduleExported(c, './fixtures/externalize/b.js'));

      //require should be exposed
      test.ok(c.require);

      //common module required
      test.ok(c.require('events'));

      test.done();
    });


  },

  extensions: function (test) {
    test.expect(2);
    var context = getIncludedModules('tmp/extensions.js');

    test.ok(moduleExported(context, './fixtures/extensions/a.js'));
    var bPath = './fixtures/extensions/b.fjs';
    test.ok(compareOutputs(context.exports['b'], require(bPath)));

    test.done();
  },

  noParse: function (test) {
    test.expect(2);

    var context = getIncludedModules('tmp/noParse.js', domWindow());

    test.ok(moduleExported(context, './fixtures/noParse/a.js'));

    //jquery is defined on the window
    test.ok(context.window.$);

    test.done();
  },

  shim: function (test) {
    test.expect(2);

    var context = getIncludedModules('tmp/shim.js', domWindow());

    test.ok(moduleExported(context, './fixtures/shim/a.js'));

    //jquery is defined on the window
    test.ok(context.window.$);

    test.done();
  },

  shimMulti: function (test) {
    test.expect(4);

    ['tmp/shim-a.js', 'tmp/shim-b.js'].forEach(function (file) {
      var context = getIncludedModules(file, domWindow());

      test.ok(moduleExported(context, './fixtures/shim/a.js'));

      //jquery is defined on the window
      test.ok(context.window.$);
    });

    test.done();
  },

  shimNoParse: function (test) {
    test.expect(2);

    var context = getIncludedModules('tmp/shimNoParse.js', domWindow());

    test.ok(moduleExported(context, './fixtures/shim/a.js'));

    //jquery is defined on the window
    test.ok(context.window.$);

    test.done();
  },

  sourceMaps: function (test) {
    test.expect(1);

    var actual = readFile('tmp/sourceMaps.js');
    test.ok(actual.match(/\/\/@ sourceMappingURL=/));

    test.done();
  },

  postCallback: function(test) {
    test.expect(1);

    var actual = readFile('tmp/post.txt');
    test.ok(actual === 'Hello World!');

    test.done();
  }

};

