import fs from 'fs';
import path from 'path';
import test from 'tape';
import load from 'load-json-file';
import write from 'write-json-file';
import envelope from '@turf/envelope';
import { randomPolygon }  from '@turf/random';
import { lineString } from '@turf/helpers';
import { getCoords } from '@turf/invariant';
import pointGrid from '@turf/point-grid';
import matrixToGrid from './matrix-to-grid';
import isobands from './';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        jsondata: load.sync(directories.in + filename)
    };
});

test('isobands', t => {
    fixtures.forEach(({name, jsondata, filename}) => {

        let breaks, points, zProperty, breaksProperties, commonProperties;
        // allow geojson featureCollection...
        if (filename.includes('geojson')) {
            breaks = jsondata.properties.breaks;
            zProperty = jsondata.properties.zProperty;
            commonProperties = jsondata.properties.commonProperties;
            breaksProperties = jsondata.properties.breaksProperties;
            points = jsondata;
        } else {
            // ...or matrix input
            const matrix = jsondata.matrix;
            const cellSize = jsondata.cellSize;
            const origin = jsondata.origin;
            breaks = jsondata.breaks;
            zProperty = jsondata.zProperty;
            points = matrixToGrid(matrix, origin, cellSize, { zProperty, units: jsondata.units });
            commonProperties = jsondata.commonProperties;
            breaksProperties = jsondata.breaksProperties;
        }

        const results = isobands(points, breaks, {
            zProperty: zProperty,
            commonProperties: commonProperties,
            breaksProperties: breaksProperties
        });

        const box = lineString(getCoords(envelope(points))[0]);
        box.properties['stroke'] = '#F00';
        box.properties['stroke-width'] = 1;
        results.features.push(box);

        if (process.env.REGEN) write.sync(directories.out + name + '.geojson', results);
        t.deepEqual(results, load.sync(directories.out + name + '.geojson'), name);
    });

    t.end();
});

test('isobands -- throws', t => {
    const points = pointGrid([-70.823364, -33.553984, -70.473175, -33.302986], 5);

    t.throws(() => isobands(randomPolygon(), [1, 2, 3]), 'invalid points');
    t.throws(() => isobands(points, ''), 'invalid breaks');
    t.throws(() => isobands(points, [1, 2, 3], {zProperty: 'temp', breaksProperties: 'hello' }), 'invalid options');

    t.end();
});
