const path = require('path');
// const {point, lineString, featureCollection} = require('@turf/helpers');
const {point} = require('@turf/helpers');
// const rhumbDestination = require('@turf/rhumb-destination');
const load = require('load-json-file');
const fs = require('fs');
const test = require('tape');
const write = require('write-json-file');
// const getCoords = require('@turf/invariant').getCoords;
const rhumbBearing = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('bearing', t => {
    for (const {name, filename, geojson} of fixtures) {

        const start = geojson.features[0];
        const end = geojson.features[1];

        const initialBearing = rhumbBearing(start, end);
        const finalBearing = rhumbBearing(start, end, true);

        const result = {
            "initialBearing": initialBearing,
            "finalBearing": finalBearing
        };
        if (process.env.REGEN) write.sync(directories.out + name +'.json', result);
        t.deepEqual(load.sync(directories.out + name + '.json'), result, name);

        // TODO adopt the following graphical output once rhumbDestination is published
        //
        // const initialDestination = rhumbDestination(start, 1000, initialBearing);
        // const initialLine = lineString([getCoords(start), getCoords(initialDestination)], {
        //     'stroke': '#F00',
        //     'stroke-width': 6
        // });
        //
        // const finalDestination = rhumbDestination(end, 1000, finalBearing - 180);
        // const finalLine = lineString([getCoords(end), getCoords(finalDestination)], {
        //     'stroke': '#00F',
        //     'stroke-width': 6
        // });
        //
        // const result = featureCollection([start, end, initialLine, finalLine]);
        //
        // if (process.env.REGEN) write.sync(directories.out + filename, result);
        // t.deepEqual(load.sync(directories.out + filename), result, name);
    }

    t.throws(() => { rhumbBearing(point([12, -54]), 'point'); }, 'invalid point');

    t.end();
});
