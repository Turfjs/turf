import path from 'path';
import glob from 'glob';
import Benchmark from 'benchmark';
import load from 'load-json-file';
import bbox from '@turf/bbox';
import contains from './';

/**
 * Benchmark Results
 *
 */
const suite = new Benchmark.Suite('turf-boolean-is-valid');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    feature1.bbox = bbox(feature1);
    feature2.bbox = bbox(feature2);

    console.time(name);
    contains(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => contains(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
