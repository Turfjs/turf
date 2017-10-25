import fs from 'fs';
import path from 'path';
import Benchmark from 'benchmark';
import tin from './';

const points = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'Points.json')));

const suite = new Benchmark.Suite('turf-tin');
suite
  .add('turf-tin', () => tin(points, 'elevation'))
  .on('cycle', event => console.log(String(event.target)))
  .on('complete', () => {})
  .run();
