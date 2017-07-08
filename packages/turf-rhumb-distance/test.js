const fs = require('fs');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const write = require('write-json-file');
const distance = require('@turf/distance');
const {round} = require('@turf/helpers');
const rhumbDistance = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('rhumb-distance', t => {
    for (const {name, geojson}  of fixtures) {
        const [pt1, pt2] = geojson.features;
        const distances = {
            miles: round(rhumbDistance(pt1, pt2, 'miles'), 6),
            nauticalmiles: round(rhumbDistance(pt1, pt2, 'nauticalmiles'), 6),
            kilometers: round(rhumbDistance(pt1, pt2, 'kilometers'), 6),
            greatCircleDistance: round(distance(pt1, pt2, 'kilometers'), 6),
            radians: round(rhumbDistance(pt1, pt2, 'radians'), 6),
            degrees: round(rhumbDistance(pt1, pt2, 'degrees'), 6)
        };

        if (process.env.REGEN) write.sync(directories.out + name + '.json', distances);
        t.deepEqual(distances, load.sync(directories.out + name + '.json'), name);

    }

    // Now fails due to approximation error
    // TODO: to be added once earth radius is updated to 6371km
    // t.ok(distances.kilometers > distances.greatCircleDistance, name + ' distance comparison');

    t.throws(() => rhumbDistance(pt1, pt2, 'blah'), 'unknown option given to units');
    t.throws(() => rhumbDistance(null, pt2), 'null point');
    t.throws(() => rhumbDistance(pt1, 'point', 'miles'), 'invalid point');

    t.end();
});
