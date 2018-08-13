import node from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import butternut from 'rollup-plugin-butternut'

const pckg = require('./package')
const input = 'src/index.js'

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
    plugins: [commonjs(), node(), butternut()]
}];
