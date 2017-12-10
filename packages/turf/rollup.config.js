import node from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

const input = 'index.js'

export default [{
    input,
    output: [
        {file: 'turf.mjs', format: 'es'},
        {file: 'turf.js', format: 'cjs'},
    ],
    plugins: [commonjs(), node()]
},
{
    input,
    output: {
        file: 'turf.min.js',
        format: 'umd',
        name: 'turf'
    },
    plugins: [commonjs(), node(), uglify()]
}];
