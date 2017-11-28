import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import truncate from '@turf/truncate';
import centroid from '@turf/centroid';
import { featureEach } from '@turf/meta';
import { featureCollection } from '@turf/helpers';
import nearestNeighborAnalysis from '.';

test('turf-nearest-neighbor', t => {
  glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
    // Define params
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const options = geojson.options;
    const results = featureCollection([]);
    featureEach(geojson, feature => results.features.push(truncate(feature)));
    if (geojson.features[0].geometry.type === "Polygon") {
      featureEach(geojson, feature => results.features.push(truncate(centroid(feature, {"marker-color": "#0a0"}))));
    }
    results.features.push(truncate(nearestNeighborAnalysis(geojson, options)));
    const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'));
    if (process.env.REGEN) write.sync(out, results);
    t.deepEqual(results, load.sync(out), name);
  });
  t.end();
});
