import node from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import {rollup} from 'rollup';

const input = 'index.js';
const plugins = [commonjs(), node(), uglify()];
const format = 'cjs';

rollup({input, plugins})
    .catch(catchError)
    .then(generate);

function generate(value) {
    value.generate({format})
        .catch(catchError);
}

function catchError(e) {
    throw new Error(e);
}
