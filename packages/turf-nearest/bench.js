import fs from 'fs';
import path from 'path';
import Benchmark from 'benchmark';
import nearest from './';

var pt = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'pt.geojson')));
var pts = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'pts.geojson')));

var suite = new Benchmark.Suite('turf-nearest');
suite
  .add('turf-nearest', () => nearest(pt, pts))
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
