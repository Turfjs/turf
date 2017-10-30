import fs from 'fs';
import path from 'path';
import Benchmark from 'benchmark';
import nearestPoint from './';

var pt = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'pt.geojson')));
var pts = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'pts.geojson')));

var suite = new Benchmark.Suite('turf-nearest-point');
suite
  .add('turf-nearest-point', () => nearestPoint(pt, pts))
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
