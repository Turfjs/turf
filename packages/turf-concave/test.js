var concave = require('./');
var test = require('tape');
var fs = require('fs');

var pts1 = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/pts1.geojson'));
var pts2 = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/pts2.geojson'));

test('concave', function(t){
  var pts1HullMiles = concave(pts1, 5.5, 'miles');
  var pts1HullKilometers = concave(pts1, 5.5 * 1.60934, 'kilometers');
  t.ok(pts1HullMiles, 'computes hull');
  t.equal(pts1HullMiles.type, 'Feature');
  t.deepEqual(pts1HullMiles, pts1HullKilometers, 'miles and km should return the same result');

  var pts2HullMiles = concave(pts2, 2, 'miles');
  var pts2HullKilometers = concave(pts2, 2 * 1.60934, 'kilometers');
  t.ok(pts2HullMiles, 'computes hull');
  t.equal(pts2HullMiles.type, 'Feature');
  t.deepEqual(pts2HullMiles, pts2HullKilometers, 'miles and km should return the same result');

  // output results
  pts1.features = pts1.features.map(stylePt);
  pts1.features.push(pts1HullMiles);
  pts2.features = pts2.features.map(stylePt);
  pts2.features.push(pts2HullMiles);
  fs.writeFileSync(__dirname+'/test/fixtures/out/pts1_out.geojson', JSON.stringify(pts1,null,2));
  fs.writeFileSync(__dirname+'/test/fixtures/out/pts2_out.geojson', JSON.stringify(pts2,null,2));

  t.end();
});

function stylePt(pt){
  pt.properties['marker-color'] = '#f0f';
  pt.properties['marker-size'] = 'small';
  return pt;
}
