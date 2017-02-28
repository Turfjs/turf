import nodeResolve from 'rollup-plugin-node-resolve';
const pkg = require('./package.json');

export default {
    entry: 'index.es6.js',
    plugins: [
        nodeResolve({})
    ],
    targets: [
        {dest: pkg['main'], format: 'cjs'},
        {dest: pkg['browser'], format: 'umd'}
    ]
};
