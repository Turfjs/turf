var random = require('../../turf-random');
var isobands = require('../../turf-isobands');

var randomPoints = random('point', 50, {
  bbox: [0, 30, 20, 50]
});
for (var j = 0; j < randomPoints.features.length; j++) {
  randomPoints.features[j].properties.elevation = Math.round(Math.random() * 1000) / 100;
}
console.log('randomPoints:\n', JSON.stringify(randomPoints));

var breaks = [0, 3, 5, 7, 10];
var bands = isobands(randomPoints, breaks, 'elevation');

console.log('bands:\n', JSON.stringify(bands));


