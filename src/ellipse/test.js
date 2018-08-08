import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import circle from '../circle';
import truncate from '../truncate';
import geojsonhint from '@mapbox/geojsonhint';
import bboxPolygon from '../bbox-polygon';
import rhumbDestination from '../rhumb-destination';
// import destination from '../destination';
import { featureCollection } from '../helpers';

import ellipse from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

test('turf-ellipse', t => {
    glob.sync(directories.in + '*.geojson').forEach(filepath => {
        // Define params
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const center = geojson.geometry.coordinates;
        let {xSemiAxis, ySemiAxis, steps, angle, units} = geojson.properties;
        angle = angle || 0;
        const options = {steps, angle, units};
        const maxAxis = Math.max(xSemiAxis, ySemiAxis);

        // Styled results
        const maxDestination0 = rhumbDestination(center, maxAxis, angle, {units});
        const maxDestination90 = rhumbDestination(center, maxAxis, angle + 90, {units});
        const maxDestination180 = rhumbDestination(center, maxAxis, angle + 180, {units});
        const maxDestination270 = rhumbDestination(center, maxAxis, angle + 270, {units});

        const xDestination0 = rhumbDestination(center, xSemiAxis, angle, {units});
        const xDestination90 = rhumbDestination(center, xSemiAxis, angle + 90, {units});
        const xDestination180 = rhumbDestination(center, xSemiAxis, angle + 180, {units});
        const xDestination270 = rhumbDestination(center, xSemiAxis, angle + 270, {units});

        const yDestination0 = rhumbDestination(center, ySemiAxis, angle, {units});
        const yDestination90 = rhumbDestination(center, ySemiAxis, angle + 90, {units});
        const yDestination180 = rhumbDestination(center, ySemiAxis, angle + 180, {units});
        const yDestination270 = rhumbDestination(center, ySemiAxis, angle + 270, {units});

        const bboxX = colorize(bboxPolygon([
            xDestination270.geometry.coordinates[0],
            yDestination180.geometry.coordinates[1],
            xDestination90.geometry.coordinates[0],
            yDestination0.geometry.coordinates[1],
        ]), '#FFF');
        const bboxY = colorize(bboxPolygon([
            yDestination270.geometry.coordinates[0],
            xDestination180.geometry.coordinates[1],
            yDestination90.geometry.coordinates[0],
            xDestination0.geometry.coordinates[1],
        ]), '#666');
        const bboxMax = colorize(bboxPolygon([
            maxDestination270.geometry.coordinates[0],
            maxDestination180.geometry.coordinates[1],
            maxDestination90.geometry.coordinates[0],
            maxDestination0.geometry.coordinates[1],
        ]), '#000');

        const results = featureCollection([
            bboxX,
            bboxY,
            bboxMax,
            geojson,
            truncate(colorize(circle(center, maxAxis, options), '#F00')),
            truncate(colorize(ellipse(center, xSemiAxis, ySemiAxis, options), '#00F')),
            truncate(colorize(ellipse(center, xSemiAxis, ySemiAxis, {steps, angle: angle + 90, units}), '#0F0')),
        ]);

        // Save to file
        if (process.env.REGEN) write.sync(directories.out + base, result);
        t.deepEqual(result, load.sync(directories.out + base), name);
    });
    t.end();
});

test('turf-ellipse -- with coordinates', t => {
    t.assert(ellipse([-100, 75], 5, 1));
    t.end();
});

test('turf-ellipse -- validate geojson', t => {
    const E = ellipse([0, 0], 10, 20);
    geojsonhint.hint(E).forEach(hint => t.fail(hint.message));
    t.end();
});

function colorize(feature, color) {
    color = color || '#F00';
    feature.properties['stroke-width'] = 6;
    feature.properties.stroke = color;
    feature.properties.fill = color;
    feature.properties['fill-opacity'] = 0;
    return feature;
}
