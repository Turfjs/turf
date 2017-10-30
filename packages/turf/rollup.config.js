import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'index.js',
    output: {
        format: 'cjs',
        file: 'main.js',
        extend: true,
    },
    plugins: [
        nodeResolve({module: true, jsnext: true}),
        commonjs({include: 'node_modules/**'}),
    ]
};