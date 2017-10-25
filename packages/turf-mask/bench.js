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

let fixtures = fs.readdirSync(directories.in).map(folder => {
    const files = {folder};
    fs.readdirSync(path.join(directories.in, folder)).forEach(filename => {
        const name = path.parse(filename).name;
        files[name] = load.sync(path.join(directories.in, folder, filename));
    });
    return files;
});
// const include = [
//     'basic',
//     // 'overlapping',
//     // 'feature-collection',
//     // 'multipolygon'
// ];
// fixtures = fixtures.filter(fixture => include.indexOf(fixture.folder) !== -1);

for (const {folder, polygon, mask} of fixtures) {
    suite.add(folder, () => turfMask(polygon, mask));
}

suite
    .on('cycle', (event) => { console.log(String(event.target)); })
    .on('complete', () => {})
    .run();
