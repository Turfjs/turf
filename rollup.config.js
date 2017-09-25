export default [{
    input: 'index.js',
    output: {
        extend: true,
        file: 'index.es5.js',
        format: 'cjs'
    }
}, {
    input: 'test.js',
    output: {
        extend: true,
        file: 'test.es5.js',
        format: 'cjs'
    }
}];
