const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('../truncate').default;
const centroid = require('../centroid').default;
const { featureEach } = require('../meta');
const { featureCollection } = require('../helpers');
const nearestNeighborAnalysis = require('.').default;


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

test('turf-nearest-neighbor', t => {
  for (const {filename, name, geojson}  of fixtures) {
    // Define params
    const options = geojson.options;
    const results = featureCollection([]);
    featureEach(geojson, feature => results.features.push(truncate(feature)));
    if (geojson.features[0].geometry.type === "Polygon") {
      featureEach(geojson, feature => results.features.push(truncate(centroid(feature, {properties: {"marker-color": "#0a0"}}))));
    }
    results.features.push(truncate(nearestNeighborAnalysis(geojson, options)));

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);

  };
  t.end();
});
