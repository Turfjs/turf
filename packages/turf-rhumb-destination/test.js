const write = require('write-json-file');
const load = require('load-json-file');
const fs = require('fs');
const path = require('path');
const test = require('tape');
// const distance = require('@turf/distance');
const truncate = require('@turf/truncate');
const getCoords = require('@turf/invariant').getCoords;
const {featureCollection, lineString, point} = require('@turf/helpers');
const rhumbDestination = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        inputPoint: load.sync(directories.in + filename)
    };
});

test('turf-rhumb-destination', t => {
    for (const {filename, name, inputPoint}  of fixtures) {
        let {bearing, dist, units} = inputPoint.properties || {};
        bearing = (bearing !== undefined) ? bearing : 180;
        dist = (dist !== undefined) ? dist : 100;
        units = units || 'kilometers';

        const resultPoint = rhumbDestination(inputPoint, dist, bearing, units);
        const line = truncate(lineString([getCoords(inputPoint), getCoords(resultPoint)], {"stroke": "#F00", "stroke-width": 4}));
        inputPoint.properties['marker-color'] = '#F00';
        const result = featureCollection([line, inputPoint, resultPoint]);
        // const d = distance(inputPoint, resultPoint, units);

        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
        // t.equals(dist, round(d, 9), 'distance');
    }

    const pt = point([12, -54]);
    t.throws(() => { rhumbDestination(pt, 100, 45, 'blah') }, 'unknown option given to units');
    t.throws(() => { rhumbDestination(pt, -200, 75 ); }, 'invalid distance');
    t.throws(() => { rhumbDestination(pt, null, 75 ); }, 'missing distance');
    t.throws(() => { rhumbDestination('point', 200, 75, 'miles'); }, 'invalid point');

    t.end();
});
