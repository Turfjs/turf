const isobands = require('./');
const Benchmark = require('benchmark');
const fs = require('fs');

const points = JSON.parse(fs.readFileSync(__dirname+'/geojson/Points.geojson'));

const suite = new Benchmark.Suite('turf-isobands');

suite
  .add('turf-isobands', () => isobands(points, 'elevation', 15, [5, 45, 55, 65, 85,  95, 105, 120, 180], false) )
  .on('cycle', (event) => console.log(String(event.target)) )
  .on('complete', () => {})
  .run();