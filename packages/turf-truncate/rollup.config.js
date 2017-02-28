const pkg = require('./package.json');

export default {
    entry: 'index.es6.js',
    targets: [
        {dest: pkg['main'], format: 'cjs'},
        {dest: pkg['browser'], format: 'umd'}
    ]
};
