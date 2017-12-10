import typescript from './rollup-plugins/typescript-export';

export default {
    input: 'index.js',
    output: [
        {file: 'main.js', format: 'cjs'},
        {file: 'main.es.js', format: 'es'}
    ],
    plugins: [typescript()]
}
