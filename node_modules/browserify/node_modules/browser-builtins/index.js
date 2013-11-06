
var fs = require('fs');
var path = require('path');

// core modules replaced by their browser capable counterparts
var core = {};

// load core modules from builtin dir
fs.readdirSync(path.resolve(__dirname, 'builtin')).forEach(function(file) {
  core[path.basename(file, '.js')] = path.resolve(__dirname, 'builtin', file);
});

// manually resolve modules that would otherwise resolve as core
core['punycode'] = path.resolve(__dirname, 'node_modules', 'punycode', 'punycode.js');

// manually add core which are provided by modules
core['http'] = require.resolve('http-browserify');
core['vm'] = require.resolve('vm-browserify');
core['crypto'] = require.resolve('crypto-browserify');
core['console'] = require.resolve('console-browserify');
core['zlib'] = require.resolve('zlib-browserify');
core['buffer'] = require.resolve('buffer-browserify');
core['constants'] = require.resolve('constants-browserify');
core['os'] = path.resolve(require.resolve('os-browserify'), '..', 'browser.js');

module.exports = core;
