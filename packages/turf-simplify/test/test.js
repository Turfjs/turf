var simplify = require('../');
var test = require('tape');
var fs = require('fs');

test('simplify -- line', function (t) {
  var line = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/linestring.geojson'));

  var simplified = simplify(line, 0.01, false);
  t.ok(simplified);
  t.equal(simplified.type, 'Feature');
  t.equal(typeof simplified.geometry.coordinates[0][0], 'number');
  if (process.env.UPDATE) fs.writeFileSync(__dirname+'/fixtures/out/linestring_out.geojson', JSON.stringify(simplified, null, 2));

  t.end();
});

test('simplify -- multiline', function (t) {
  var multiline = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/multilinestring.geojson'));

  var simplified = simplify(multiline, 0.01, false);
  t.ok(simplified);
  t.equal(simplified.type, 'Feature');
  var len = multiline.geometry.coordinates.length,
    i;
  for (i = 0; i < len; i++) {
    t.equal(typeof simplified.geometry.coordinates[i][0][0], 'number');
  }
  if (process.env.UPDATE) fs.writeFileSync(__dirname+'/fixtures/out/multilinestring_out.geojson', JSON.stringify(simplified, null, 2));

  t.end();
});

test('simplify -- polygon', function (t) {
  var polygon = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/polygon.geojson'));

  var simplified = simplify(polygon, 1, false);
  t.equal(simplified.type, 'Feature');
  t.equal(typeof simplified.geometry.coordinates[0][0][0], 'number');
  if (process.env.UPDATE) fs.writeFileSync(__dirname+'/fixtures/out/polygon_out.geojson', JSON.stringify(simplified, null, 2));

  t.end();
});

test('simplify -- over simplify polygon', function (t) {
  var polygon = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/simple.geojson'));

  var simplified = simplify(polygon, 100, false);
  t.equal(simplified.type, 'Feature');
  t.equal(typeof simplified.geometry.coordinates[0][0][0], 'number');
  if (process.env.UPDATE) fs.writeFileSync(__dirname+'/fixtures/out/simple_out.geojson', JSON.stringify(simplified, null, 2));

  t.end();
});

test('simplify -- multipolygon', function (t) {
  var multipolygon = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/multipolygon.geojson'));

  var simplified = simplify(multipolygon, 0.01, false);
  t.equal(simplified.type, 'Feature');
  var len = multipolygon.geometry.coordinates.length,
    i;
  for (i = 0; i < len; i++) {
    t.equal(typeof simplified.geometry.coordinates[i][0][0][0], 'number');
  }
  if (process.env.UPDATE) fs.writeFileSync(__dirname+'/fixtures/out/multipolygon_out.geojson', JSON.stringify(simplified, null, 2));

  t.end();
});

test('simplify -- featurecollection', function (t) {
  var featurecollection = JSON.parse((fs.readFileSync(__dirname+'/fixtures/in/featurecollection.geojson')));

  var simplified = simplify(featurecollection, 0.01, false);
  t.equal(simplified.type, 'FeatureCollection');

  if (process.env.UPDATE) fs.writeFileSync(__dirname+'/fixtures/out/featurecollection_out.geojson', JSON.stringify(simplified, null, 2));

  t.end();
});

test('simplify -- geometrycollection', function (t) {
  var geometrycollection = JSON.parse((fs.readFileSync(__dirname+'/fixtures/in/geometrycollection.geojson')));

  var simplified = simplify(geometrycollection, 0.01, false);
  t.equal(simplified.type, 'GeometryCollection');
  simplified.geometries.forEach(function (g) {
    if (g.type === 'LineString') {
      t.equal(typeof g.coordinates[0][0], 'number');
    } else if (g.type === 'MultiLineString' || g.type === 'Polygon') {
      // intentionally only checking the first line for multilinestring, test covered elsewhere
      t.equal(typeof g.coordinates[0][0][0], 'number');
    } else if (g.type === 'MultiPolygon') {
      // intentionally only checking the first ring, test covered elsewhere
      t.equal(typeof g.coordinates[0][0][0][0], 'number');
    }
  });

  if (process.env.UPDATE) fs.writeFileSync(__dirname+'/fixtures/out/geometrycollection_out.geojson', JSON.stringify(simplified, null, 2));

  t.end();
});

test('simplify -- argentina', function (t) {
  var argentina = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/argentina.geojson'));

  var simplified = simplify(argentina, 0.1, false);
  t.equal(simplified.type, 'Feature');
  t.equal(typeof simplified.geometry.coordinates[0][0][0], 'number');
  if (process.env.UPDATE) fs.writeFileSync(__dirname+'/fixtures/out/argentina_out.geojson', JSON.stringify(simplified, null, 2));

  t.end();
});
