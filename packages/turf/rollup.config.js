import uglify from 'rollup-plugin-uglify-es';
import nodeResolve from 'rollup-plugin-node-resolve';

export default [
    {
        input: 'index.js',
        output: {
            file: 'dist/turf.js',
            format: 'umd',
            extend: true,
            sourcemap: true,
            name: 'turf'
        },
        plugins: [nodeResolve()]
    },
    {
        input: 'index.js',
        output: {
            file: 'dist/turf.min.js',
            format: 'umd',
            extend: true,
            sourcemap: true,
            name: 'turf'
        },
        plugins: [nodeResolve(), uglify()]
    },
];
