const fs = require('fs');
const path = require('path');
const Benchmark = require('benchmark');
const constrainedTin = require('./').default;

const points = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'Points.json')));

const suite = new Benchmark.Suite('turf-constrained-tin');
suite
  .add('turf-constrained-tin', () => constrainedTin(points, [2, 12], {z: 'elevation'}))
  .on('cycle', event => console.log(String(event.target)))
  .on('complete', () => {})
  .run();

//turf-constrained-tin:
