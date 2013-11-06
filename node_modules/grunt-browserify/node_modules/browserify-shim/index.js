'use strict';

var path    =  require('path')
  , fs      =  require('fs')
  , format  =  require('util').format
  , through =  require('through')
  , buildScriptDir    =  path.dirname(module.parent.filename)
  ;

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

function preValidate(browserifyInstance, configs) {
  if (!browserifyInstance || typeof browserifyInstance.require !== 'function' || typeof browserifyInstance.transform !== 'function')
    throw new Error('browserify-shim needs to be passed a proper browserify instance as the first argument.\n' +
                   ' you passed:' + inspect(browserifyInstance));
  if (!configs || typeof configs !== 'object') 
    throw new Error('browserify-shim needs to be passed a hashmap of one or more shim configs as the second argument.');
}

function validate(config) {
  if (!config.hasOwnProperty('path'))
    throw new Error('browserify-shim needs at least a path and exports to do its job, you are missing the path.');
  if (!config.hasOwnProperty('exports'))
    throw new Error('browserify-shim needs at least a path and exports to do its job, you are missing the exports.');
}

function requireDependencies(depends) {
  if (!depends) return '';

  return Object.keys(depends)
    .map(function (k) { return { alias: k, exports: depends[k] || null }; })
    .reduce(
      function (acc, dep) {
        return dep.exports 
          ? acc + 'global.' + dep.exports + ' = require("' + dep.alias + '");\n'
          : acc + 'require("' + dep.alias + '");\n';
      }
    , '\n; '
  );
}

function bindWindowWithExports(s, dependencies) {
  // purposely make module and define be 'undefined',
  // but pass a function that allows exporting our dependency from the window or the context
  
  return '(function browserifyShim(module, exports, define, browserify_shim__define__module__export__) {\n'
      + dependencies 
      + s
      + '\n}).call(global, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });\n';
}

function bindWindowWithoutExports(s, dependencies) {
  // if a module doesn't need anything to be exported, it is likely, that it exports itself properly
  // therefore it is not a good idea to override the module here

  return '(function browserifyShim(module, define) {\n'
      + dependencies 
      + s
      + '\n}).call(global, module, undefined);\n';
}

function moduleExport(exp) {
  return format('\n; browserify_shim__define__module__export__(typeof %s != "undefined" ? %s : window.%s);\n', exp, exp, exp);
}

function wrap(content, config) {
  var exported = config.exports
      ? content + moduleExport(config.exports)
      : content
  , dependencies = requireDependencies(config.depends)
  , boundWindow = config.exports
      ? bindWindowWithExports(exported, dependencies)
      : bindWindowWithoutExports(exported, dependencies);

  return boundWindow;
}

module.exports = function shim(browserifyInstance, configs) {
  var shims = {};
  preValidate(browserifyInstance, configs);

  Object.keys(configs)
    .forEach(function (alias) {
      var config = configs[alias];

      validate(config);

      var resolvedPath = require.resolve(path.resolve(buildScriptDir, config.path));

      shims[resolvedPath] = config;
      browserifyInstance.require(resolvedPath, { expose: alias });
    });

  browserifyInstance.transform(function (file) {
      var content = '';
      return through(
          function write(buf) {
            content += buf;
          }
        , function end() {
            var config = shims[file] 
              , transformed = config ? wrap(content, config) : content;

            this.queue(transformed);
            this.queue(null);
          }
      );
  });
  
  return browserifyInstance;
};
