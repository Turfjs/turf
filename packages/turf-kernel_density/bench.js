/*jshint esversion: 6 */
import Benchmark from 'benchmark';
import kernelDensity from '.';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';

/**
 * Benchmark Results
 *
 * <Place results here>
 */
const suite = new Benchmark.Suite('turf-kernel_density');
glob.sync(path.join(__dirname, 'test', 'in', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const features = geojson.features;
    console.time(name);
    kernelDensity(features);
    console.timeEnd(name);
    suite.add(name, () => kernelDensity(features));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
