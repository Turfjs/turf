import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'index.js',
    output: {
        extend: true,
        file: 'turf.js',
        format: 'umd',
        name: 'turf'
    },
    plugins: [
        nodeResolve({module: true, jsnext: true}),
        babel({exclude: 'node_modules/**'}),
        commonjs({include: 'node_modules/**'})
    ]
};
