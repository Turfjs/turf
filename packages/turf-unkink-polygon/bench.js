const load = require('load-json-file');
const fs = require('fs');
const path = require('path');
const Benchmark = require('benchmark');
const unkink = require('.');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {filename, geojson: load.sync(directories.in + filename)};
});

const suite = new Benchmark.Suite('unkink-polygon');

// Add all fixtures to Benchmark
for (const fixture of fixtures) {
    suite.add(fixture.filename, () => unkink(fixture.geojson));
}

suite
  .on('cycle', (event) => { console.log(String(event.target)); })
  .on('complete', () => {})
  .run();
