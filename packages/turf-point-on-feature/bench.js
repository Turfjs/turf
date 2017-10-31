import fs from 'fs';
import Benchmark from 'benchmark';
import centroid from './';

const fc = JSON.parse(fs.readFileSync(__dirname + '/test/polygons.geojson'));

const suite = new Benchmark.Suite('turf-point-on-feature');
suite
  .add('turf-point-on-feature', () => centroid(fc))
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
