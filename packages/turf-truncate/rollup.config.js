const pkg = require('./package.json');

export default {
    entry: 'index.es6.js',
    format: 'cjs',
    dest: pkg['main']
};
