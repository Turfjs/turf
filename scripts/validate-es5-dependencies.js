const node = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const commonjs = require('rollup-plugin-commonjs');
const {rollup} = require('rollup');

const input = 'index.js';
const plugins = [commonjs(), node(), uglify()];
const format = 'cjs';

rollup({input, plugins})
    .then(generate)
    .catch(catchError);

function generate(value) {
    value.generate({format})
        .then(illegalSyntax)
        .catch(catchError);
}

function illegalSyntax({code}) {
    if (code.includes('Object.assign(')) throw new Error('"Object.assign" syntax is invalid');
    if (code.includes('const ')) throw new Error('"const" syntax is invalid');
    if (code.includes('let ')) throw new Error('"let" syntax is invalid');
    if (code.includes('=> ')) throw new Error('"=>" syntax is invalid');
}

function catchError(e) {
    throw new Error(e);
}
