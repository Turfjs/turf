import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import unkink from '.';

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
