// const Benchmark = require('benchmark');
const load = require('load-json-file');
const clustersDistance = require('./');


const points1 = load.sync('test/in/points2.geojson');

clustersDistance(points1, 500);

// const suite = new Benchmark.Suite('turf-clusters');
// suite
//   .add('clusters-distance', () => {
//       clustersDistance(points1, 500);
//   })
//   .on('cycle', e => console.log(String(e.target)))
//   .on('complete', () => {})
//   .run();
