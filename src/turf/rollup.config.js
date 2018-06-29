import node from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

const pckg = require('./package')
const input = 'index.mjs'

export default [{
    input,
    output: [
        {file: pckg.main + '.js', format: 'umd', name: 'turf'},
        {file: pckg.module, format: 'es'},
    ],
    plugins: [commonjs(), node()]
},
{
    input,
    output: [
        {file: pckg.browser, format: 'umd', name: 'turf'}
    ],
    plugins: [commonjs(), node(), uglify()]
}];
