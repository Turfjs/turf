var concave = require('./');
var test = require('tape');
var fs = require('fs');
var featureCollection = require('@turf/helpers').featureCollection;
var point = require('@turf/helpers').point;

var pts1 = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/pts1.geojson'));
var pts2 = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/pts2.geojson'));
var pts3 = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/issue-333.geojson'));

// test('concave', function(t){
//
//   var ptsOnePoint = featureCollection([point([0, 0])]);
//   var ptsOnePointHull = null;
//   t.throws(function(){
//       ptsOnePointHull = concave(ptsOnePoint, 5.5, 'miles');
//   }, Error, 'fails with too few points');
//   t.notOk(ptsOnePointHull, 'hull not computed with too few points');
//
//   var ptsNoPointHull = null;
//   t.throws(function(){
//       ptsNoPointHull = concave(pts1, 0, 'miles');
//   }, Error, 'fails with small maxEdge');
//   t.notOk(ptsNoPointHull, 'hull not computed with small maxEdge');
//
//   t.end();
// });

test('concave', function(t){
  // var pts1HullMiles = concave(pts1, 5.5, 'miles');
  // var pts1HullKilometers = concave(pts1, 5.5 * 1.60934, 'kilometers');
  // t.ok(pts1HullMiles, 'computes hull');
  // t.equal(pts1HullMiles.type, 'Feature');
  // t.deepEqual(pts1HullMiles, pts1HullKilometers, 'miles and km should return the same result');
  //
  // var pts2HullMiles = concave(pts2, 2, 'miles');
  // var pts2HullKilometers = concave(pts2, 2 * 1.60934, 'kilometers');
  // t.ok(pts2HullMiles, 'computes hull');
  // t.equal(pts2HullMiles.type, 'Feature');
  // t.deepEqual(pts2HullMiles, pts2HullKilometers, 'miles and km should return the same result');

  var pts3HullMiles = concave(pts3, 2, 'miles');
  var pts3HullKilometers = concave(pts3, 2 * 1.60934, 'kilometers');
  t.ok(pts3HullMiles, 'computes hull');
  t.equal(pts3HullMiles.type, 'Feature');
  t.deepEqual(pts3HullMiles, pts3HullKilometers, 'miles and km should return the same result');

  // output results
  // pts1.features = pts1.features.map(stylePt);
  // pts1.features.push(pts1HullMiles);
  // pts2.features = pts2.features.map(stylePt);
  // pts2.features.push(pts2HullMiles);
  pts3.features = pts3.features.map(stylePt);
  pts3.features.push(pts3HullMiles);
  // fs.writeFileSync(__dirname+'/test/fixtures/out/pts1_out.geojson', JSON.stringify(pts1,null,2));
  // fs.writeFileSync(__dirname+'/test/fixtures/out/pts2_out.geojson', JSON.stringify(pts2,null,2));
  fs.writeFileSync(__dirname+'/test/fixtures/out/issue-333_out.geojson', JSON.stringify(pts3,null,2));

  t.end();
});

function stylePt(pt){
  pt.properties['marker-color'] = '#f0f';
  pt.properties['marker-size'] = 'small';
  return pt;
}
