import typescriptExport from './scripts/rollup-plugin-typescript-export';
import validES5 from './scripts/rollup-plugin-valid-es5';

export default {
    input: 'index.js',
    output: {
        extend: true,
        file: 'main.js',
        format: 'cjs'
    },
    plugins: [typescriptExport(), validES5()]
};
