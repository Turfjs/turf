var overlaps = require('../'),
  test = require('tape'),
  glob = require('glob'),
  fs = require('fs');

var REGEN = true;

test('overlaps -- polygon', function(t){
  poly1 = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/polygon0.geojson'));
  poly2 = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/polygon1.geojson'));
  poly3 = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/polygon2.geojson'));

  t.ok(overlaps(poly1, poly2), "Polygons 1 and 2 overlap");
  t.ok(overlaps(poly2, poly3), "Polygons 2 and 3 overlap");
  t.notOk(overlaps(poly1, poly3), "Polygons 1 and 3 do not overlap")
  t.end();
});

test('overlaps -- linestring', function(t){
  line1 = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/linestring0.geojson'));
  line2 = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/linestring1.geojson'));
  line3 = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/linestring2.geojson'));

  t.ok(overlaps(line1, line2), "LineStrings 1 and 2 overlap");
  t.ok(overlaps(line2, line3), "LineStrings 2 and 3 overlap");
  t.notOk(overlaps(line1, line3), "LineStrings 1 and 3 do not overlap")
  t.end();
});

