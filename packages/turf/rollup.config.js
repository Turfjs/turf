import uglify from 'rollup-plugin-uglify-es';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

function assign(options) {
    const file = options.file;
    const format = options.format || 'umd';
    const plugins = [
        commonjs({ include: 'node_modules/**' }),
        nodeResolve({ module: true, jsnext: true })
    ].concat(options.plugins || []);
    console.log(plugins);
    return {
        input: 'index.mjs',
        output: {
            file: file,
            format: format,
            extend: true,
            sourcemap: true,
            name: 'turf'
        },
        plugins: plugins,
    };
}

export default [
    assign({file: 'turf.js'}),
    assign({file: 'turf.min.js', plugins: [uglify()]}),
];
