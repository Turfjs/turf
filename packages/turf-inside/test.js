var test = require('tape');
var point = require('@turf/helpers').point;
var polygon = require('@turf/helpers').polygon;
var fs = require('fs');
var inside = require('./');

test('featureCollection', function (t) {
  // test for a simple polygon
  var poly = polygon([[[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]]]);
  var ptIn = point([50, 50]);
  var ptOut = point([140, 150]);

  t.true(inside(ptIn, poly), 'point inside simple polygon');
  t.false(inside(ptOut, poly), 'point outside simple polygon');

  // test for a concave polygon
  var concavePoly = polygon([[[0,0], [50, 50], [0,100], [100,100], [100,0], [0,0]]]);
  var ptConcaveIn = point([75, 75]);
  var ptConcaveOut = point([25, 50]);

  t.true(inside(ptConcaveIn, concavePoly), 'point inside concave polygon');
  t.false(inside(ptConcaveOut, concavePoly), 'point outside concave polygon');

  t.end();
});

test('poly with hole', function (t) {
  var ptInHole = point([-86.69208526611328, 36.20373274711739]);
  var ptInPoly = point([-86.72229766845702, 36.20258997094334]);
  var ptOutsidePoly = point([-86.75079345703125, 36.18527313913089]);
  var polyHole = JSON.parse(fs.readFileSync(__dirname + '/test/in/poly-with-hole.geojson'));

  t.false(inside(ptInHole, polyHole));
  t.true(inside(ptInPoly, polyHole));
  t.false(inside(ptOutsidePoly, polyHole));

  t.end();
});

test('multipolygon with hole', function (t) {
  var ptInHole = point([-86.69208526611328, 36.20373274711739]);
  var ptInPoly = point([-86.72229766845702, 36.20258997094334]);
  var ptInPoly2 = point([-86.75079345703125, 36.18527313913089]);
  var ptOutsidePoly = point([-86.75302505493164, 36.23015046460186]);
  var multiPolyHole = JSON.parse(fs.readFileSync(__dirname + '/test/in/multipoly-with-hole.geojson'));

  t.false(inside(ptInHole, multiPolyHole));
  t.true(inside(ptInPoly, multiPolyHole));
  t.true(inside(ptInPoly2, multiPolyHole));
  t.true(inside(ptInPoly, multiPolyHole));
  t.false(inside(ptOutsidePoly, multiPolyHole));

  t.end();
});

test('Boundary test', function (t) {
  var poly1 = polygon([[
    [ 10, 10 ],
    [ 30, 20 ],
    [ 50, 10 ],
    [ 30,  0 ],
    [ 10, 10 ]
  ]]);
  var poly2 = polygon([[
    [ 10,  0 ],
    [ 30, 20 ],
    [ 50,  0 ],
    [ 30, 10 ],
    [ 10,  0 ]
  ]]);
  var poly3 = polygon([[
    [ 10,  0 ],
    [ 30, 20 ],
    [ 50,  0 ],
    [ 30, -20 ],
    [ 10,  0 ]
  ]]);
  var poly4 = polygon([[
    [  0,  0 ],
    [  0, 20 ],
    [ 50, 20 ],
    [ 50,  0 ],
    [ 40,  0 ],
    [ 30, 10 ],
    [ 30,  0 ],
    [ 20, 10 ],
    [ 10, 10 ],
    [ 10,  0 ],
    [  0,  0 ]
  ]]);
  var poly5 = polygon([[
    [  0, 20 ],
    [ 20, 40 ],
    [ 40, 20 ],
    [ 20,  0 ],
    [  0, 20 ]
  ],[
    [ 10, 20 ],
    [ 20, 30 ],
    [ 30, 20 ],
    [ 20, 10 ],
    [ 10, 20 ]
  ]]);
  function runTest(t, ignoreBoundary) {
    var isBoundaryIncluded = (ignoreBoundary === false);
    var tests = [
      [poly1, point([ 10, 10 ]), isBoundaryIncluded], //0
      [poly1, point([ 30, 20 ]), isBoundaryIncluded],
      [poly1, point([ 50, 10 ]), isBoundaryIncluded],
      [poly1, point([ 30, 10 ]), true],
      [poly1, point([  0, 10 ]), false],
      [poly1, point([ 60, 10 ]), false],
      [poly1, point([ 30,-10 ]), false],
      [poly1, point([ 30, 30 ]), false],
      [poly2, point([ 30,  0 ]), false],
      [poly2, point([  0,  0 ]), false],
      [poly2, point([ 60,  0 ]), false], //10
      [poly3, point([ 30,  0 ]), true],
      [poly3, point([  0,  0 ]), false],
      [poly3, point([ 60,  0 ]), false],
      [poly4, point([  0, 20 ]), isBoundaryIncluded],
      [poly4, point([ 10, 20 ]), isBoundaryIncluded],
      [poly4, point([ 50, 20 ]), isBoundaryIncluded],
      [poly4, point([  0, 10 ]), isBoundaryIncluded],
      [poly4, point([  5, 10 ]), true],
      [poly4, point([ 25, 10 ]), true],
      [poly4, point([ 35, 10 ]), true], //20
      [poly4, point([  0,  0 ]), isBoundaryIncluded],
      [poly4, point([ 20,  0 ]), false],
      [poly4, point([ 35,  0 ]), false],
      [poly4, point([ 50,  0 ]), isBoundaryIncluded],
      [poly4, point([ 50, 10 ]), isBoundaryIncluded],
      [poly4, point([  5,  0 ]), isBoundaryIncluded],
      [poly4, point([ 10,  0 ]), isBoundaryIncluded],
      [poly5, point([ 20, 30 ]), isBoundaryIncluded],
      [poly5, point([ 25, 25 ]), isBoundaryIncluded],
      [poly5, point([ 30, 20 ]), isBoundaryIncluded], //30
      [poly5, point([ 25, 15 ]), isBoundaryIncluded],
      [poly5, point([ 20, 10 ]), isBoundaryIncluded],
      [poly5, point([ 15, 15 ]), isBoundaryIncluded],
      [poly5, point([ 10, 20 ]), isBoundaryIncluded],
      [poly5, point([ 15, 25 ]), isBoundaryIncluded],
      [poly5, point([ 20, 20 ]), false]
    ];

    var testTitle = "Boundary " + (ignoreBoundary ? "ignored " : "") + "test number ";
    for (var i=0;i<tests.length;i++) {
      var item = tests[i];
        t.true(inside(item[1], item[0], ignoreBoundary) == item[2], testTitle + i);
    }
  }
  runTest(t, false);
  runTest(t, true);
  t.end();
});

// https://github.com/Turfjs/turf-inside/issues/15
test(t => {
    var pt1 = point([-9.9964077, 53.8040989]);
    var poly = polygon([[
        [5.080336744095521, 67.89398938540765],
        [0.35070899909145403, 69.32470003971179],
        [-24.453622256504122, 41.146696777884564],
        [-21.6445524714804, 40.43225902006474],
        [5.080336744095521, 67.89398938540765]
    ]]);

    t.true(inside(pt1, poly));
    t.end();
});
