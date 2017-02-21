var Benchmark = require('benchmark');
var grid = require('.');

var bbox = [
    -96.6357421875,
    31.12819929911196,
    -84.9462890625,
    40.58058466412764
];

var lowres = grid(bbox, 100, 'miles').features.length;
var midres = grid(bbox, 10, 'miles').features.length;
var highres = grid(bbox, 1, 'miles').features.length;

var suite = new Benchmark.Suite('turf-hex-grid');
suite
    .add('turf-hex-grid -- ' + lowres + ' cells', function () {
        grid(bbox, 100, 'miles');
    })
    .add('turf-hex-grid -- ' + midres + ' cells', function () {
        grid(bbox, 10, 'miles');
    })
    .add('turf-hex-grid -- ' + highres + ' cells', function () {
        grid(bbox, 1, 'miles');
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
    })
    .run();
