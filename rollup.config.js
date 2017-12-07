import typescript from './rollup-plugins/typescript-export';
import buble from 'rollup-plugin-buble';

export default [{
    input: 'index.js',
    output: {
        file: 'main.mjs',
        format: 'es'
    }
}, {
    input: 'index.js',
    output: {
        file: 'main.js',
        format: 'cjs'
    },
    plugins: [typescript(), buble()]
}]
