import typescriptExport from './rollup-plugins/typescript-export';
import validES5 from './rollup-plugins/valid-es5';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify-es';

export default [{
    input: 'index.js',
    output: {
        extend: true,
        file: 'main.js',
        format: 'cjs'
    },
    plugins: [typescriptExport(), nodeResolve()]
}, {
    input: 'index.js',
    output: {
        extend: true,
        file: 'main.min.js',
        format: 'cjs'
    },
    plugins: [typescriptExport(), uglify(), nodeResolve()]
}];
