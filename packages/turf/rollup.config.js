import node from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

const pckg = require('./package.json')
const input = 'index.mjs'

export default [{
    input,
    output: [
        {file: pckg.main, format: 'cjs'},
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
