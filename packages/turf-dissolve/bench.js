import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import dissolve from '.';

const polys = load.sync(path.join(__dirname, 'test', 'in', 'polys.geojson'));

const suite = new Benchmark.Suite('turf-dissolve');
suite
    .add('polys', () => dissolve(polys))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
