var test = require('tape'),
  point = require('turf-helpers').point,
  multipoint = require('turf-helpers').multiPoint,
  linestring = require('turf-helpers').lineString,
  multilinestring = require('turf-helpers').multiLineString,
  polygon = require('turf-helpers').polygon,
  multipolygon = require('turf-helpers').multiPolygon,
  featurecollection = require('turf-helpers').featureCollection;

var combine = require('./')

test('combine -- points', function(t) {
  // MultiPoint
  var pt1 = point([50, 51])
  var pt2 = point([100, 101])

  var multiPt = combine(featurecollection([pt1, pt2]))

  t.ok(multiPt, 'should combine two Points into a MultiPoint')
  t.deepEqual(multiPt.features[0].geometry.coordinates, [[50, 51], [100, 101]])
  t.end();
});

test('combine -- mixed multipoint & point', function(t) {
  // MultiPoint
  var pt1 = point([50, 51])
  var pt2 = multipoint([[100, 101], [101, 102]])

  var multiPt = combine(featurecollection([pt1, pt2]))

  t.ok(multiPt, 'should combine Points + MultiPoint into a MultiPoint')
  t.deepEqual(multiPt.features[0].geometry.coordinates, [[50, 51], [100, 101], [101, 102]])
  t.end();
});

test('combine -- linestrings', function(t) {
  // MultiLineString
  var l1 = linestring([
    [102.0,
    -10.0],
    [130.0,
    4.0]])
  var l2 = linestring([
    [40.0,
    -20.0],
    [150.0,
    18.0]])

  var multiLine = combine(featurecollection([l1, l2]))

  t.ok(multiLine, 'should combine two LineStrings into a MultiLineString')
  t.equal(multiLine.features[0].geometry.type, 'MultiLineString')
  t.deepEqual(multiLine.features[0].geometry.coordinates, [[[102, -10], [130, 4]], [[40, -20], [150, 18]]])
  t.end();
});

test('combine -- mixed multilinestring & linestring', function(t) {
  // MultiLineString
  var l1 = linestring([
    [102.0, -10.0],
    [130.0, 4.0]
  ]);
  var l2 = multilinestring([
    [
      [40.0, -20.0],
      [150.0, 18.0]
    ],
    [
      [50, -10],
      [160, 28]
    ]
  ]);

  var multiLine = combine(featurecollection([l1, l2]))

  t.ok(multiLine, 'should combine LineString + MultiLineString into a MultiLineString')
  t.equal(multiLine.features[0].geometry.type, 'MultiLineString')
  t.deepEqual(multiLine.features[0].geometry.coordinates, [[[102, -10], [130, 4]], [[40, -20], [150, 18]], [[50, -10], [160, 28]]])
  t.end();
});

test('combine -- polygons', function(t) {
  // MultiPolygon
  var p1 = polygon( [
      [
        [20.0,0.0],
        [101.0,0.0],
        [101.0,1.0],
        [100.0,1.0],
        [100.0,0.0],
        [20.0,0.0]
      ]
    ])
  var p2 = polygon([
      [
        [30.0,0.0],
        [102.0,0.0],
        [103.0,1.0],
        [30.0,0.0]
      ]
    ])
    var multiPoly = combine(featurecollection([p1, p2]))

    t.ok(multiPoly, 'should combine two Polygons into a MultiPolygon')
    t.equal(multiPoly.features[0].geometry.type, 'MultiPolygon')
    t.deepEqual(multiPoly.features[0].geometry.coordinates,
        [[[[20,0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0],[20,0]]],
        [[[30.0,0.0],[102.0,0.0],[103.0,1.0],[30.0,0.0]]]])

  t.end()
});

test('combine -- polygons', function(t) {
  // MultiPolygon
  var p1 = polygon( [
    [
      [20.0,0.0],
      [101.0,0.0],
      [101.0,1.0],
      [100.0,1.0],
      [100.0,0.0],
      [20.0,0.0]
    ]
  ]);
  var p2 = multipolygon([
    [[
      [30.0,0.0],
      [102.0,0.0],
      [103.0,1.0],
      [30.0,0.0]
    ]],
    [
      [
        [20.0,5.0],
        [92.0,5.0],
        [93.0,6.0],
        [20.0,5.0]
      ],
      [
        [25, 5],
        [30, 5],
        [30, 5.5],
        [25, 5]
      ]
    ]
  ]);
  var multiPoly = combine(featurecollection([p1, p2]))

  t.ok(multiPoly, 'should combine two Polygon + MultiPolygon into a MultiPolygon')
  t.equal(multiPoly.features[0].geometry.type, 'MultiPolygon')
  t.deepEqual(multiPoly.features[0].geometry.coordinates,
      [[[[20,0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0],[20,0]]],
      [[[30.0,0.0],[102.0,0.0],[103.0,1.0],[30.0,0.0]]],
      [[[20.0,5.0],[92.0,5.0],[93.0,6.0],[20.0,5.0]],
       [[25, 5],[30, 5],[30, 5.5],[25, 5]]]
  ])

  t.end()
});

test('combine -- heterogenous', function(t) {
  // MultiPolygon
  var p1 = polygon( [
    [
      [20.0,0.0],
      [101.0,0.0],
      [101.0,1.0],
      [100.0,1.0],
      [100.0,0.0],
      [20.0,0.0]
    ]
  ]);
  var p2 = multipolygon([
    [[
      [30.0,0.0],
      [102.0,0.0],
      [103.0,1.0],
      [30.0,0.0]
    ]],
    [
      [
        [20.0,5.0],
        [92.0,5.0],
        [93.0,6.0],
        [20.0,5.0]
      ],
      [
        [25, 5],
        [30, 5],
        [30, 5.5],
        [25, 5]
      ]
    ]
  ]);
  var pt1 = point([50, 51])
  var multiPoly = combine(featurecollection([p1, p2, pt1]))

  t.ok(multiPoly, 'should combine two Polygon + MultiPolygon into a MultiPolygon')
  t.equal(multiPoly.features[0].geometry.type, 'MultiPoint')

  t.equal(multiPoly.features[1].geometry.type, 'MultiPolygon')
  t.deepEqual(multiPoly.features[1].geometry.coordinates,
      [[[[20,0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0],[20,0]]],
      [[[30.0,0.0],[102.0,0.0],[103.0,1.0],[30.0,0.0]]],
      [[[20.0,5.0],[92.0,5.0],[93.0,6.0],[20.0,5.0]],
       [[25, 5],[30, 5],[30, 5.5],[25, 5]]]
  ])

  t.end()
});
