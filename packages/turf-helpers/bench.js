const Benchmark = require('benchmark');
const helpers = require('.');
const {
  point, lineString, polygon,
  multiPoint, multiLineString, multiPolygon,
  featureCollection, geometryCollection} = helpers;

const suite = new Benchmark.Suite('turf-helpers');
suite
    .add('point', () => point([5, 10]))
    .add('lineString', () => lineString([[5, 10], [20, 40]]))
    .add('polygon', () => polygon([[[5, 10], [20, 40], [40, 0], [5, 10]]]))
    .add('multiPoint', () => multiPoint([[0, 0], [10, 10]]))
    .add('multiLineString', () => multiLineString([[[0, 0], [10, 10]], [[5, 0], [15, 8]]]))
    .add('multiPolygon', () => multiPolygon([[[[94, 57], [78, 49], [94, 43], [94, 57]]], [[[93, 19], [63, 7], [79, 0], [93, 19]]]]))
    .add('featureCollection', () => featureCollection([point([5, 10]), point([5, 10])]))
    .add('geometryCollection', () => geometryCollection([{type: 'Point', coordinates: [100, 0]}, {type: 'Point', coordinates: [100, 0]}]))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
