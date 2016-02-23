var test = require('tape');
var sample = require('./');
var featureCollection = require('turf-helpers').featureCollection;
var point = require('turf-helpers').point;

test('remove', function(t){
  var points = featureCollection(
    [point([1,2], {team: 'Red Sox'}),
    point([2,1], {team: 'Yankees'}),
    point([3,1], {team: 'Nationals'}),
    point([2,2], {team: 'Yankees'}),
    point([2,3], {team: 'Red Sox'}),
    point([4,2], {team: 'Yankees'})]);

  newFC = sample(points, 4);

  t.equal(newFC.features.length, 4, 'should sample 4 features');
  t.end();
});
