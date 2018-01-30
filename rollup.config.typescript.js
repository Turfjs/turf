import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'index.ts',
    output: [
        {file: 'index.js', format: 'cjs'},
        {file: 'index.mjs', format: 'es'}
    ],
    plugins: [typescript()]
};
