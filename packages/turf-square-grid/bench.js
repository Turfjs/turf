import Benchmark from 'benchmark';
import squareGrid from './';

var bbox = [-95, 30, -85, 40];

var highres = squareGrid(bbox, 100, 'miles').features.length;
var midres = squareGrid(bbox, 10, 'miles').features.length;
var lowres = squareGrid(bbox, 1, 'miles').features.length;
var suite = new Benchmark.Suite('turf-square-grid');
suite
  .add('highres -- ' + highres + ' cells', () => squareGrid(bbox, 100, 'miles'))
  .add('midres  -- ' + midres + ' cells', () => squareGrid(bbox, 10, 'miles'))
  .add('lowres  -- ' + lowres + ' cells', () => squareGrid(bbox, 1, 'miles'))
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
