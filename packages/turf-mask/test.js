const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const mkdirp = require('mkdirp');
const mask = require('.');

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
var include = ['basic', 'feature-collection'];
fixtures = fixtures.filter(fixture => include.indexOf(fixture.folder) !== -1);

test('turf-mask', t => {
    for (const fixture  of fixtures) {
        const folder = fixture.folder;

        // Line Intersect
        const masked = mask(fixture.polygon, fixture.mask);
        // const debug = mask(fixture.polygon, fixture.mask, true);

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
