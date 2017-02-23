const load = require('load-json-file');
const path = require('path');
const Benchmark = require('benchmark');
const unkink = require('.');

// Fixture
const geojson = load.sync(path.join(__dirname, 'test', 'in', 'hourglass.geojson'));

const suite = new Benchmark.Suite('unkink-polygon');
suite
  .add('single', () => unkink(geojson))
  .on('cycle', (event) => { console.log(String(event.target)); })
  .on('complete', () => {})
  .run();
