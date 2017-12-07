import buble from 'rollup-plugin-buble';
import node from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'

const input = 'index.js'

export default [{
    input,
    output: {
        file: 'turf.mjs',
        format: 'es',
    },
    plugins: [node()]
},{
    input,
    output: {
        file: 'turf.js',
        format: 'cjs',
    },
    plugins: [node(), buble()]
},
{
    input,
    output: {
        file: 'turf.min.js',
        format: 'umd',
        name: 'turf'
    },
    plugins: [node(), buble(), uglify()]
}];
