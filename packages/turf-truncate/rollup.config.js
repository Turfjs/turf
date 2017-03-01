var pkg = require('./package.json');

module.exports = {
    entry: 'index.es6.js',
    format: 'cjs',
    dest: pkg['main']
};
