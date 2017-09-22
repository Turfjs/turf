import uglify from 'rollup-plugin-uglify-es';
import nodeResolve from 'rollup-plugin-node-resolve';

export default [
    {
        input: 'index.mjs',
        output: {
            file: 'turf.js',
            format: 'umd',
            name: 'turf'
        },
        plugins: [nodeResolve()]
    },
    {
        input: 'index.mjs',
        output: {
            file: 'turf.min.js',
            format: 'umd',
            name: 'turf'
        },
        plugins: [nodeResolve(), uglify()]
    },
];
