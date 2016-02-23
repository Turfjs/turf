var test = require('tape');
var reclass = require('./');
var fs = require('fs');

test('reclass', function(t){
  var inField = 'elevation';
  var outField = 'heightIndex';
  var translations = [[0, 20, 1], [20, 40, 2], [40, 60 , 3], [60, Infinity, 4]];
  var points = JSON.parse(fs.readFileSync(__dirname+'/geojson/Points.geojson'));

  var reclassed = reclass(points, inField, outField, translations);

  t.ok(reclassed.features, 'should take a feature collection and an array of translations and return a new featurecollection reclassed');
  t.equal(reclassed.features[0].geometry.type, 'Point');

  t.end();
});