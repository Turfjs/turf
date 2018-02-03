import tsc from 'typescript';
import typescript from 'rollup-plugin-typescript';

export default {
    input: 'index.ts',
    output: [
        {file: 'index.js', format: 'cjs'},
        {file: 'index.mjs', format: 'es'}
    ],
    plugins: [typescript({typescript: tsc})]
};
