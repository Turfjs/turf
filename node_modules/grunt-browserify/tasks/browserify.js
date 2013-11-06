'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through');

/*
 * grunt-browserify
 * https://github.com/jmreidy/grunt-browserify
 *
 * Copyright (c) 2013 Justin Reidy
 * Licensed under the MIT license.
 */
var browserify = require('browserify');
var shim = require('browserify-shim');

module.exports = function (grunt) {
  grunt.registerMultiTask('browserify', 'Grunt task for browserify.', function () {
    var task = this;
    var opts;
    var ctorOpts = {};
    var shims;


    grunt.util.async.forEachSeries(this.files, function (file, next) {
      var aliases;
      opts = task.options();

      ctorOpts.entries = grunt.file.expand({filter: 'isFile'}, file.src).map(function (f) {
        return path.resolve(f);
      });

      if (opts.extensions) {
        ctorOpts.extensions = opts.extensions;
        delete opts.extensions;
      }

      if (opts.noParse) {
        ctorOpts.noParse = opts.noParse.map(function (filePath) {
          return path.resolve(filePath);
        });
        delete opts.noParse;
      }

      var b = browserify(ctorOpts);
      b.on('error', function (err) {
        grunt.fail.warn(err);
      });

      if (opts.ignore) {
        grunt.file.expand({nonull: true}, grunt.util._.flatten(opts.ignore))
          .forEach(function (file) {
            var ignoreFile = file;

            try {
              if (fs.statSync(file).isFile()) {
                ignoreFile = path.resolve(file);
              }
            } catch (e) {
              // don't do anything
            }

            b.ignore(ignoreFile);
          });
      }

      if (opts.alias) {
        aliases = opts.alias;
        if (aliases.split) {
          aliases = aliases.split(',');
        }

        aliases = grunt.util._.flatten(aliases);

        aliases.forEach(function (alias) {
          alias = alias.split(':');
          var aliasSrc = alias[0];
          var aliasDest = alias[1];
          var aliasDestResolved, aliasSrcResolved;

          // if the source has '/', it might be an inner module; resolve as filepath
          // only if it's a valid one
          if (/\//.test(aliasSrc)) {
            aliasSrcResolved = path.resolve(aliasSrc);
            aliasSrc = grunt.file.exists(aliasSrcResolved) && grunt.file.isFile(aliasSrcResolved) ?
              aliasSrcResolved : aliasSrc;
          }
          //if the alias exists and is a filepath, resolve it if it's a valid path
          if (aliasDest && /\//.test(aliasDest)) {
            aliasDestResolved = path.resolve(aliasDest);
            aliasDest = grunt.file.exists(aliasDestResolved) && grunt.file.isFile(aliasDestResolved) ? aliasDestResolved : aliasDest;
          }

          if (!aliasDest) {
            aliasDest = aliasSrc;
          }

          b.require(aliasSrc, {expose: aliasDest});
        });
      }

      if (opts.aliasMappings) {
        aliases = grunt.util._.isArray(opts.aliasMappings) ? opts.aliasMappings : [opts.aliasMappings];
        aliases.forEach(function (alias) {
          alias.expand = true; // so the user doesn't have to specify
          grunt.file.expandMapping(alias.src, alias.dest, alias)
            .forEach(function (file) {
              var expose = file.dest.substr(0, file.dest.lastIndexOf('.'));
              b.require(path.resolve(file.src[0]), {expose: expose});
            });
        });
      }

      if (opts.shim) {
        shims = opts.shim;
        var noParseShimExists = false;
        var shimPaths = Object.keys(shims)
          .map(function (alias) {
            var shimPath = path.resolve(shims[alias].path);
            shims[alias].path = shimPath;
            if (!noParseShimExists) {
              noParseShimExists = ctorOpts.noParse && ctorOpts.noParse.indexOf(shimPath) > -1;
            }
            return shimPath;
          });
        b = shim(b, shims);
        if (noParseShimExists) {
          var shimmed = [];
          b.transform(function (file) {
            if (shimmed.indexOf(file) < 0 &&
                ctorOpts.noParse.indexOf(file) > -1 &&
                shimPaths.indexOf(file) > -1) {
              shimmed.push(file);
              var data = 'var global=self;';
              var write = function (buffer) {
                return data += buffer;
              };
              var end = function () {
                this.queue(data);
                this.queue(null);
              };
              return through(write, end);
            }
            return through();
          });
        }
      }

      if (opts.external) {
        var externalFiles = [];
        var externalModules = [];

        grunt.util._.flatten(opts.external).forEach(function (external) {
          if (/\//.test(external)) {
            var expandedExternals = grunt.file.expand(external);
            if (expandedExternals.length > 0) {
              expandedExternals.forEach(function (dest) {
                var externalResolved = path.resolve(dest);
                if (grunt.file.exists(externalResolved)) {
                  externalFiles.push(externalResolved);
                }
                else {
                  externalModules.push(dest);
                }
              });
            }
            else {
              externalModules.push(external);
            }
          }
          else {
            externalModules.push(external);
          }
        });

        //treat existing files as normal
        externalFiles.forEach(function (external) {
          b.external(external);
        });

        //filter arbitrary external ids from normal browserify behavior
        if (externalModules.length > 0) {
          var _filter;
          externalModules.forEach(function (external) {
            b.external(external);
          });
          if (opts.filter) {
            _filter = opts.filter;
          }
          opts.filter = function (id) {
            var included = externalModules.indexOf(id) < 0;
            if (_filter) { return _filter(id) && included; }
            else { return included; }
          };
        }
      }

      if (opts.externalize) {
        grunt.fail.warn('Externalize is deprecated, please use alias instead');
        opts.externalize.forEach(function (lib) {
          if (/\//.test(lib)) {
            grunt.file.expand({filter: 'isFile'}, lib).forEach(function (file) {
              b.require(path.resolve(file));
            });
          }
          else {
            b.require(lib);
          }
        });
      }

      if (opts.transform) {
        opts.transform.forEach(function (transform) {
          b.transform(transform);
        });
      }

      var destPath = path.dirname(path.resolve(file.dest));
      if (!grunt.file.exists(destPath)) {
        grunt.file.mkdir(destPath);
      }

      var onBundleComplete = function (err, src) {
        if (err) {
          grunt.log.error(err);
          grunt.fail.warn('Error running grunt-browserify.');
        }

        grunt.file.write(file.dest, src);
        grunt.log.ok('Bundled ' + file.dest);
        next();
      };

      b.bundle(opts, function (err, src) {
        if (opts.postBundleCB) {
          opts.postBundleCB(err, src, onBundleComplete);
        }
        else {
          onBundleComplete(err, src);
        }
      });

    }, this.async());
  });
};

