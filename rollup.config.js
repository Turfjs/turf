import typescript from './rollup-plugins/typescript-export';

export default {
    input: 'index.mjs',
    output: [
        {file: 'index.js', format: 'cjs'}
    ],
    plugins: [typescript()]
}
