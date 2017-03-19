const fs = require('fs');
const path = require('path');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const lineChunk = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {filename, geojson: load.sync(directories.in + filename)};
});

const suite = new Benchmark.Suite('turf-line-chunk');

fixtures.forEach(({filename, geojson}) => {
    suite.add(filename, function () {
        lineChunk(geojson, 5, 'miles');
    });
});

suite
  .on('cycle', function (event) {
      console.log(String(event.target));
  })
  .on('complete', function () {})
  .run();
