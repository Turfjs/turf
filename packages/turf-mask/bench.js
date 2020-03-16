import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import turfMask from '.';

const suite = new Benchmark.Suite('turf-mask');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(path.join(directories.in, filename))
    };
});

for (const {name, geojson} of fixtures) {
    const [polygon, masking] = geojson.features;
    suite.add(name, () => turfMask(polygon, masking));
}

suite
    .on('cycle', (event) => { console.log(String(event.target)); })
    .on('complete', () => {})
    .run();
