import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import { featureCollection } from '@turf/helpers';
import center from '@turf/center';
import centerOfMass from '@turf/center-of-mass';
import centerMean from '@turf/center-mean';
import centerMedian from '.';

test('turf-center-median', t => {
    glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
        // Define params
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const properties = geojson.properties || {}
        const options = {
          weight: properties.weight,
          tolerance: properties.tolerance
        };
        const meanCenter = colorize(centerMean(geojson, options), '#a00');
        const medianCenter = colorize(centerMedian(geojson, options), '#0a0');
        const extentCenter = colorize(center(geojson), '#00a');
        const massCenter = colorize(centerOfMass(geojson), '#aaa');
        const results = featureCollection([
          geojson,
          meanCenter,
          medianCenter,
          extentCenter,
          massCenter
        ]);
        const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'));
        if (process.env.REGEN) write.sync(out, results);
        t.deepEqual(results, load.sync(out), name);
    });


    t.end();
});

function colorize(point, color) {
  point.properties['marker-color'] = color;
  point.properties['marker-symbol'] = 'cross';
  return point;
}
