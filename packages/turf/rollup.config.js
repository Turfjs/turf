import uglify from 'rollup-plugin-uglify-es';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

function config(file, format, plugins) {
    plugins = [
        commonjs({ include: 'node_modules/**' }),
        nodeResolve({ module: true, jsnext: true })
    ].concat(plugins || []);

    return {
        input: 'index.js',
        output: {
            file,
            format,
            extend: true,
            sourcemap: true,
            name: 'turf'
        },
        plugins,
    };
}

export default [
    config('turf.js', 'umd'),
    config('turf.min.js', 'umd', [uglify()]),
];
