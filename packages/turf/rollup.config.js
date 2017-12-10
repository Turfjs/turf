import node from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import pckg from './package.json'

const input = 'index.js'

export default [{
    input,
    output: [
        {file: pckg.main, format: 'umd', name: 'turf'},
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
