const test = require('tape');
const glob = require('glob');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate').default;
const centroid = require('@turf/centroid').default;
const { featureEach } = require('@turf/meta');
const { featureCollection } = require('@turf/helpers');
const nearestNeighborAnalysis = require('.').default;



test('turf-nearest-neighbor', t => {
  glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
    // Define params
    const {name} = path.parse(filepath);    
    const geojson = load.sync(filepath);
    const options = geojson.options;
    const results = featureCollection([]);
    featureEach(geojson, feature => results.features.push(truncate(feature)));
    if (geojson.features[0].geometry.type === "Polygon") {
      featureEach(geojson, feature => results.features.push(truncate(centroid(feature, {properties: {"marker-color": "#0a0"}}))));
    }
    results.features.push(truncate(nearestNeighborAnalysis(geojson, options)));    
    const out = filepath.replace('in', 'out');    
    if (process.env.REGEN) write.sync(out, results);    
    t.deepEqual(results, load.sync(out), name);
    
  });
  t.end();
});
