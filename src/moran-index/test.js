const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const { featureCollection } = require('../helpers');
const { featureEach } = require('../meta');

const moranIndex = require('.').default;

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

test('moran-index', t => {
  for (const {filename, name, geojson}  of fixtures) {

    const results = moranIndex(geojson, {
      inputField: 'CRIME',
    });

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);

  };
  t.end();
});
