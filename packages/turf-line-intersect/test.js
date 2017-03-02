const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const mkdirp = require('mkdirp');
const lineIntersect = require('.');

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

test('turf-line-intersect', t => {
    for (const {folder, line1, line2}  of fixtures) {
        // Line Intersect
        const points = lineIntersect(line1, line2);
        const debug = lineIntersect(line1, line2, true);

        // Save Results
        mkdirp.sync(path.join(directories.out, folder));
        if (process.env.REGEN) {
            write.sync(path.join(directories.out, folder, 'results.geojson'), points);
            write.sync(path.join(directories.out, folder, 'debug.geojson'), debug);
        }

        // Tests
        t.deepEquals(points, load.sync(path.join(directories.out, folder, 'results.geojson')), folder);
    }
    t.end();
});
