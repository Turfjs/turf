const fs = require('fs');
const glob = require('glob');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const overlaps = require('./');


test('overlaps -- polygon', t => {
    poly1 = JSON.parse(fs.readFileSync(__dirname + '/test/in/polygon0.geojson'));
    poly2 = JSON.parse(fs.readFileSync(__dirname + '/test/in/polygon1.geojson'));
    poly3 = JSON.parse(fs.readFileSync(__dirname + '/test/in/polygon2.geojson'));

    t.true(overlaps(poly1, poly2), "Polygons 1 and 2 overlap");
    t.true(overlaps(poly2, poly3), "Polygons 2 and 3 overlap");
    t.false(overlaps(poly1, poly3), "Polygons 1 and 3 do not overlap");
    t.end();
});

test('overlaps -- linestring', t => {
    line1 = JSON.parse(fs.readFileSync(__dirname + '/test/in/linestring0.geojson'));
    line2 = JSON.parse(fs.readFileSync(__dirname + '/test/in/linestring1.geojson'));
    line3 = JSON.parse(fs.readFileSync(__dirname + '/test/in/linestring2.geojson'));

    t.true(overlaps(line1, line2), "LineStrings 1 and 2 overlap");
    t.true(overlaps(line2, line3), "LineStrings 2 and 3 overlap");
    t.false(overlaps(line1, line3), "LineStrings 1 and 3 do not overlap");
    t.end();
});

