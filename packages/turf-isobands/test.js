import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import envelope from '@turf/envelope';
import pointGrid from '@turf/point-grid';
import truncate from '@turf/truncate';
import { getCoords } from '@turf/invariant';
import { lineString } from '@turf/helpers';
import { featureEach } from '@turf/meta';
import { randomPolygon }  from '@turf/random';
import isobands from './index';
import matrixToGrid from './matrix-to-grid';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        json: load.sync(directories.in + filename)
    };
});

test('isobands', t => {
    fixtures.forEach(({name, json, filename}) => {
        const { breaks, zProperty, breaksProperties, commonProperties, units, matrix, origin, cellSize } = json.properties ? json.properties : json;

        // allow GeoJSON featureCollection or matrix
        let points;
        if (json.properties) points = json;
        else points = matrixToGrid(matrix, origin, cellSize, { zProperty, units });

        const results = truncate(isobands(points, breaks, {
            zProperty: zProperty,
            commonProperties: commonProperties,
            breaksProperties: breaksProperties
        }));

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