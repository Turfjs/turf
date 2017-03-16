const path = require('path');
const {point, lineString, featureCollection} = require('@turf/helpers');
const destination = require('@turf/destination');
const test = require('tape');
const write = require('write-json-file');
const bearing = require('./');

const out = path.join(__dirname, 'test', 'out') + path.sep;

test('bearing', t => {
    const start = point([-75, 45], {'marker-color': '#F00'});
    const end = point([20, 60], {'marker-color': '#00F'});

    const initialBearing = bearing(start, end);
    t.equal(initialBearing.toFixed(2), '37.75', 'initial bearing');

    const finalBearing = bearing(start, end, true);
    t.equal(finalBearing.toFixed(2), '120.01', 'final bearing');
    t.end();

    if (process.env.REGEN) {
        const initialDestination = destination(start, 1000, initialBearing);
        const initialLine = lineString([start.geometry.coordinates, initialDestination.geometry.coordinates], {
            'stroke': '#F00',
            'stroke-width': 6
        });

        const finalDestination = destination(end, 1000, finalBearing - 180);
        const finalLine = lineString([end.geometry.coordinates, finalDestination.geometry.coordinates], {
            'stroke': '#00F',
            'stroke-width': 6
        });

        const results = featureCollection([start, end, initialLine, finalLine]);
        write.sync(out + 'results.geojson', results);
    }
});
