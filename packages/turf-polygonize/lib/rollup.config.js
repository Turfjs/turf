import path from 'path';
import buble from 'rollup-plugin-buble';

export default {
    input: path.join(__dirname, 'polygonize', 'index.js'),
    output: [
        {file: path.join(__dirname, 'polygonize.js'), format: 'es'}
    ],
    plugins: [buble()]
}
