var isobands = require('../../turf-isobands');
var grid = require('../../turf-point-grid');

var bbox = [0, 30, 20, 50];
var cellWidth = 50;
// var units = 'miles';
var pointGrid = grid(bbox, cellWidth);
for (var i = 0; i < pointGrid.features.length; i++) {
  pointGrid.features[i].properties.elevation = Math.round(Math.random() * 1000) / 100;
}

console.log('pointGrid:\n', JSON.stringify(pointGrid));

var breaks = [0, 3, 5, 7, 10];
var bands = isobands(pointGrid, breaks, 'elevation');

console.log('bands:\n', JSON.stringify(bands));


