const path = require('path');
const test = require('tape');
const write = require('write-json-file');

const destination = require('../destination').default;
const helpers = require('../helpers')
const bearing = require('./').default;

const out = path.join(__dirname, 'test', 'out') + path.sep;

test('bearing', t => {
    const start = helpers.point([-75, 45], {'marker-color': '#F00'});
    const end = helpers.point([20, 60], {'marker-color': '#00F'});

    const initialBearing = bearing(start, end);
    t.equal(initialBearing.toFixed(2), '37.75', 'initial bearing');

    const finalBearing = bearing(start, end, {final: true});
    t.equal(finalBearing.toFixed(2), '120.01', 'final bearing');
    t.end();

    if (process.env.REGEN) {
        const initialDestination = destination(start, 1000, initialBearing);
        const initialLine = helpers.lineString([start.geometry.coordinates, initialDestination.geometry.coordinates], {
            'stroke': '#F00',
            'stroke-width': 6
        });

        const finalDestination = destination(end, 1000, finalBearing - 180);
        const finalLine = helpers.lineString([end.geometry.coordinates, finalDestination.geometry.coordinates], {
            'stroke': '#00F',
            'stroke-width': 6
        });

        const results = helpers.featureCollection([start, end, initialLine, finalLine]);
        write.sync(out + 'results.geojson', results);
    }
});
