import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'index',
    output: {
        extend: true,
        sourcemap: true,
        file: 'dist/index.js',
        format: 'cjs'
    },
    plugins: [nodeResolve()]
};
