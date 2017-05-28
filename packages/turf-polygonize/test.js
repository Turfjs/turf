const test = require('tape'),
  { featureCollection, lineString, polygon } = require('@turf/helpers'),
  polygonize = require('./'),
  fs = require('fs'),
  path = require('path'),
  load = require('load-json-file'),
  write = require('write-json-file');

const directories = {
  in: path.join(__dirname, 'test', 'in') + path.sep,
  out: path.join(__dirname, 'test', 'out') + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directories.in + filename)
  };
});

test('turf-polygonize', t => {
  for (const {filename, name, geojson}  of fixtures) {
    const results = polygonize(geojson);

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);
  }
  t.end();
});
