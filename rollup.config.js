import typescriptExport from './rollup-plugins/typescript-export';
import validES5 from './rollup-plugins/valid-es5';

export default {
    input: 'index.js',
    output: {
        extend: true,
        file: 'main.js',
        format: 'cjs'
    },
    plugins: [typescriptExport(), validES5()]
};
