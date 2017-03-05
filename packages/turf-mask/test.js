const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const mkdirp = require('mkdirp');
const turfMask = require('.');

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
//     'feature-collection',
//     'multipolygon'
// ];
// fixtures = fixtures.filter(fixture => include.indexOf(fixture.folder) !== -1);

test('turf-mask', t => {
    for (const {folder, polygon, mask} of fixtures) {
        // Line Intersect
        const masked = turfMask(polygon, mask);
        // const debug = turfMask(polygon, mask, true);

        // Save Results
        mkdirp.sync(path.join(directories.out, folder));
        if (process.env.REGEN) {
            write.sync(path.join(directories.out, folder, 'results.geojson'), masked);
            // write.sync(path.join(directories.out, folder, 'debug.geojson'), debug);
        }
        // Tests
        t.deepEquals(masked, load.sync(path.join(directories.out, folder, 'results.geojson')), folder);
    }
    t.end();
});
