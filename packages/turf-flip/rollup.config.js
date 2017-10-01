import uglify from 'rollup-plugin-uglify'

export default [{
    input: 'index.js',
    output: {
        extend: true,
        file: 'main.js',
        format: 'cjs'
    }
}, {
    input: 'index.js',
    output: {format: 'cjs'},
    plugins: [uglify()]
}];
