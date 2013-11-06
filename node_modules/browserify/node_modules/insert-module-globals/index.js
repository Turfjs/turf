var parseScope = require('lexical-scope');
var commondir = require('commondir');
var through = require('through');

var path = require('path');
var fs = require('fs');

var processModulePath = require.resolve('process/browser.js');
var processModuleSrc = fs.readFileSync(processModulePath, 'utf8');

var bufferModulePath = path.join(__dirname, 'buffer.js');
var bufferModuleSrc = fs.readFileSync(bufferModulePath, 'utf8');

var _vars = {
    process: function () {
        return {
            id: processModulePath,
            source: processModuleSrc,
        }
    },
    global: function (row, basedir) {
        return 'typeof self !== "undefined" ? self : '
            + 'typeof window !== "undefined" ? window : {}'
        ;
    },
    Buffer: function () {
        return {
            id: bufferModulePath,
            source: bufferModuleSrc,
            suffix: ".Buffer"
        }
    },
    __filename: function (row, basedir) {
        var file = '/' + path.relative(basedir, row.id);
        return JSON.stringify(file);
    },
    __dirname: function (row, basedir) {
        var dir = path.dirname('/' + path.relative(basedir, row.id));
        return JSON.stringify(dir);
    }
}

module.exports = function (files, opts) {
    if (!Array.isArray(files)) {
        opts = files;
        files = [];
    }
    if (!opts) opts = {};
    if (!files) files = [];
    
    var vars = opts.vars || _vars

    var basedir = opts.basedir || (files.length
        ? commondir(files.map(function (x) {
            return path.resolve(path.dirname(x));
        }))
        : '/'
    );
    var varNames = Object.keys(vars);
    
    var quick = RegExp(varNames.map(function (name) {
        return '\\b' + name + '\\b';
    }).join('|'));
    
    var resolved = {};

    return through(write, end);
    
    function write (row) {
        var tr = this;
        
        //remove hashbang if present
        row.source = String(row.source).replace(/^#![^\n]*\n/, '\n');
        
        if (opts.always !== true && !quick.test(row.source)) {
            return tr.queue(row);
        }
        
        var scope = opts.always
            ? { globals: { implicit: varNames } }
            : parseScope(row.source)
        ;
        
        var globals = {};
        
        varNames.forEach(function (name) {
            if (scope.globals.implicit.indexOf(name) >= 0) {
                var value = vars[name].call(tr, row, basedir);
                if (!value) {}
                else if ('object' == typeof value) {
                    value.deps = value.deps || {};
                    if (!resolved[name]) {
                        tr.queue(value);
                        tr.emit('dep', value);
                    }
                    
                    var igName = '__browserify_' + name;
                    row.deps[igName] = value.id;
                    
                    resolved[name] = true;
                    globals[name] = 'require(' 
                        + JSON.stringify(igName)
                        + ')'
                        + (value.suffix || '')
                    ;
                }
                else globals[name] = value;
            }
        });
        
        row.source = closeOver(globals, row.source);
        tr.queue(row);
    }
    
    function end () {
        this.ended = true;
        this.queue(null);
    }
};

module.exports.vars = _vars

function closeOver (globals, src) {
    var keys = Object.keys(globals);
    if (keys.length === 0) return src;
    return 'var ' + keys.map(function (key) {
        return key + '=' + globals[key];
    }).join(',') + ';' + src;
}
