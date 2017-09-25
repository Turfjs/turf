import uglify from 'rollup-plugin-uglify-es';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
    {
        input: 'index.mjs',
        output: {
            file: 'dist/turf.js',
            format: 'umd',
            extend: true,
            sourcemap: true,
            name: 'turf'
        },
        plugins: [
            commonjs({
                include: 'node_modules/**',
                exclude: [ 'node_modules/jsts/**'],
            }),
            nodeResolve({
                module: true,
                jsnext: true
            })
        ]
    },
    {
        input: 'index.mjs',
        output: {
            file: 'dist/turf.min.js',
            format: 'umd',
            extend: true,
            sourcemap: true,
            name: 'turf'
        },
        plugins: [
            commonjs({
                include: 'node_modules/**',
                exclude: [ 'node_modules/jsts/**'],
            }),
            nodeResolve({
                module: true,
                jsnext: true
            }),
            uglify()
        ]
    },
];
