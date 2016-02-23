var test = require('tape');
var filter = require('./');
var featureCollection = require('turf-helpers').featureCollection;
var point = require('turf-helpers').point;

test('remove', function(t){
  t.plan(2);

  var points = featureCollection(
    [point([1,2], {team: 'Red Sox'}),
    point([2,1], {team: 'Yankees'}),
    point([3,1], {team: 'Nationals'}),
    point([2,2], {team: 'Yankees'}),
    point([2,3], {team: 'Red Sox'}),
    point([4,2], {team: 'Yankees'})]);
  
  newFC = filter(points, 'team', 'Nationals');

  t.equal(newFC.features.length, 1, 'should filter all but 1 feature');
  t.equal(newFC.features[0].properties.team, 'Nationals', 'feature team property should be Nationals');
});
