import typescript from './rollup-plugins/typescript-export';

export default {
    input: 'index.js',
    output: [
        {file: 'main.mjs', format: 'es'},
        {file: 'main.js', format: 'cjs'}
    ],
    plugins: [typescript()]
}
