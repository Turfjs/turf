import test from 'tape';
import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import { featureCollection } from '../helpers';
import { featureEach } from '../meta';
import truncate from '../truncate';
import standardDeviationalEllipse from '.';

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

test('turf-standard-deviational-ellipse', t => {
    for (const {name, geojson} of fixtures) {
        // Define params
        const options = geojson.options;
        // Optional: ESRI Polygon in GeoJSON test/in to compare results
        const esriEllipse = geojson.esriEllipse;

        // Colorized results
        const results = featureCollection([
            colorize(standardDeviationalEllipse(geojson, options)),
        ]);
        if (esriEllipse) results.features.unshift(colorize(esriEllipse, '#A00', '#A00', 0.5))

        // Save to file
        if (process.env.REGEN) write.sync(directories.out + name + '.json', results);
        t.deepEqual(results, load.sync(directories.out + name + '.json'), name);
    };
    t.end();
});

function colorize (feature, stroke = '#0A0', fill = '#FFF', opacity = 0) {
    const properties = {
        fill,
        stroke,
        'stroke-width': 3,
        'stroke-opacity': 1,
        'fill-opacity': opacity
    };
    Object.assign(feature.properties, properties)
    return feature
}