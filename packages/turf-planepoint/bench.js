const planepoint = require('./');
const Benchmark = require('benchmark');
const fs = require('fs');

const triangle = JSON.parse(fs.readFileSync(__dirname+'/test/Triangle.geojson'));
const point = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [
      1,
      1
    ]
  }
};

const suite = new Benchmark.Suite('turf-planepoint');
suite
  .add('turf-planepoint', () => { planepoint(point, triangle); })
  .on('cycle', event => { console.log(String(event.target)); })
  .on('complete', () => {})
  .run();
