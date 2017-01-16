var test = require('tape');
var kinks = require('./');

test('kinks', function(t){
  var hourglassCoordinates = [
    [
      [
        -12.034835815429688,
        8.901183448260598
      ],
      [
        -12.060413360595701,
        8.899826693726117
      ],
      [
        -12.036380767822266,
        8.873199368734273
      ],
      [
        -12.059383392333983,
        8.871418491385919
      ],
      [
        -12.034835815429688,
        8.901183448260598
      ]
    ]
  ];
  var expected = {
    features: [
      { geometry: { coordinates: [ -12.047632938440815, 8.885666404927512 ], type: 'Point' }, properties: {}, type: 'Feature' },
      { geometry: { coordinates: [ -12.047632938440815, 8.885666404927512 ], type: 'Point' }, properties: {}, type: 'Feature' } ],
    type: 'FeatureCollection'
  };

  // Test LineString
  var hourglassLineString = {
    type: "LineString",
    coordinates: hourglassCoordinates[0]
  };

  var hourglassLineStringKinks = kinks(hourglassLineString);
  t.ok(hourglassLineStringKinks, 'get self intersection from hourglass line string');
  t.deepEqual(hourglassLineStringKinks, expected);

  // Test MultiLineString
  var hourglassMultiLineString = {
    type: "MultiLineString",
    coordinates: hourglassCoordinates
  };

  var hourglassMultiLineStringKinks = kinks(hourglassMultiLineString);
  t.ok(hourglassMultiLineStringKinks, 'get self intersection from hourglass multi line string');
  t.deepEqual(hourglassMultiLineStringKinks, expected);

  // Test MultiPolygon
  var hourglassMultiPolygon = {
    type: "MultiPolygon",
    coordinates: [hourglassCoordinates]
  };

  var hourglassMultiPolygonKinks = kinks(hourglassMultiPolygon);
  t.ok(hourglassMultiPolygonKinks, 'get self intersection from hourglass multi polygon');
  t.deepEqual(hourglassMultiPolygonKinks, expected);

  // Test Polygon
  var hourglassPolygon = {
    type: "Polygon",
    coordinates: hourglassCoordinates
  };

  var hourglassPolygonKinks = kinks(hourglassPolygon);
  t.ok(hourglassPolygonKinks, 'get self intersection from hourglass polygon');
  t.deepEqual(hourglassPolygonKinks, expected);

  var tripleCoordinates = [
    [
      [
        -44.384765625,
        1.0106897682409128
      ],
      [
        -53.4375,
        0.4833927027896987
      ],
      [
        -43.154296875,
        -6.402648405963884
      ],
      [
        -53.173828125,
        -6.708253968671543
      ],
      [
        -43.857421875,
        -13.752724664396975
      ],
      [
        -54.09667968749999,
        -14.944784875088372
      ],
      [
        -53.3935546875,
        -11.867350911459308
      ],
      [
        -44.384765625,
        1.0106897682409128
      ]
    ]
  ];

  // Test LineString
  var tripleLineString = {
    type: "LineString",
    coordinates: tripleCoordinates[0]
  };

  var tripleLineStringKinks = kinks(tripleLineString);
  t.ok(tripleLineStringKinks, 'get self intersection from triple intersecting line string');
  t.equal(tripleLineStringKinks.features.length, 6);

  // Test MultiLineString
  var tripleMultiLineString = {
    type: "MultiLineString",
    coordinates: tripleCoordinates
  };

  var tripleMultiLineStringKinks = kinks(tripleMultiLineString);
  t.ok(tripleMultiLineStringKinks, 'get self intersection from triple intersecting multi line string');
  t.equal(tripleMultiLineStringKinks.features.length, 6);

  // Test MultiPolygon
  var tripleMultiPolygon = {
    type: "MultiPolygon",
    coordinates: [tripleCoordinates]
  };

  var tripleMultiPolygonKinks = kinks(tripleMultiPolygon);
  t.ok(tripleMultiPolygonKinks, 'get self intersection from triple intersecting multi polygon');
  t.equal(tripleMultiPolygonKinks.features.length, 6);

  // Test Polygon
  var triplePolygon = {
    type: "Polygon",
    coordinates: tripleCoordinates
  };

  var triplePolygonKinks = kinks(triplePolygon);
  t.ok(triplePolygonKinks, 'get self intersection from triple intersecting polygon');
  t.equal(triplePolygonKinks.features.length, 6);

  t.end();
});

test('kinks', function (t) {
  var featureCoordinates = [
    [
      [
        -12.034835815429688,
        8.901183448260598
      ],
      [
        -12.060413360595701,
        8.899826693726117
      ],
      [
        -12.036380767822266,
        8.873199368734273
      ],
      [
        -12.059383392333983,
        8.871418491385919
      ],
      [
        -12.034835815429688,
        8.901183448260598
      ]
    ]
  ];
  var expected = {
    features: [
      { geometry: { coordinates: [ -12.047632938440815, 8.885666404927512 ], type: 'Point' }, properties: {}, type: 'Feature' },
      { geometry: { coordinates: [ -12.047632938440815, 8.885666404927512 ], type: 'Point' }, properties: {}, type: 'Feature' } ],
    type: 'FeatureCollection'
  };

  // Test LineString
  var featureLineString = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: featureCoordinates[0]
    }
  };
  var featureLineStringKinks = kinks(featureLineString);
  t.ok(featureLineStringKinks, 'get self intersection from hourglass line string feature');
  t.deepEqual(featureLineStringKinks, expected);

  // Test MultiLineString
  var featureMultiLineString = {
    type: 'Feature',
    geometry: {
      type: 'MultiLineString',
      coordinates: featureCoordinates
    }
  };
  var featureMultiLineStringKinks = kinks(featureMultiLineString);
  t.ok(featureMultiLineStringKinks, 'get self intersection from hourglass multi line string feature');
  t.deepEqual(featureMultiLineStringKinks, expected);

  // Test MultiPolygon
  var featureMultiPolygon = {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [featureCoordinates]
    }
  };
  var featureMultiPolygonKinks = kinks(featureMultiPolygon);
  t.ok(featureMultiPolygonKinks, 'get self intersection from hourglass multi polygon feature');
  t.deepEqual(featureMultiPolygonKinks, expected);

  // Test Polygon
  var featurePolygon = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: featureCoordinates
    }
  };

  var featurePolygonKinks = kinks(featurePolygon);
  t.ok(featurePolygonKinks, 'get self intersection from hourglass polygon feature');
  t.deepEqual(featurePolygonKinks, expected);

  t.end();
});


test('kinks', function (t) {
  var featureCoordinates = [
    [
      [0, 0],
      [0, 1],
      [0.25, 1],
      [0.25, 0],
      [0.5, 0],
      [0.5, 1],
      [1, 1],
      [1, 0],
      [0, 0]
    ]
  ];
  var expected = {
    type: 'FeatureCollection',
    features: [
      { geometry: { coordinates: [ 0.25, 0 ], type: 'Point' }, properties: {}, type: 'Feature' },
      { geometry: { coordinates: [ 0.5, 0 ], type: 'Point' }, properties: {}, type: 'Feature' },
      { geometry: { coordinates: [ 0.25, 0 ], type: 'Point' }, properties: {}, type: 'Feature' },
      { geometry: { coordinates: [ 0.5, 0 ], type: 'Point' }, properties: {}, type: 'Feature' }
    ]
  };

  // Test LineString
  var featureLineString = {
    type: "Feature",
    properties: {
      DN: 1
    },
    geometry: {
      type: "LineString",
      coordinates: featureCoordinates[0]
    }
  };

  var featureLineStringKinks = kinks(featureLineString);
  t.ok(featureLineStringKinks, 'get self-intersection when vertex hits another side in a line string');
  t.equal(featureLineStringKinks.features.length, 4);
  t.deepEqual(featureLineStringKinks, expected);

  // Test MultiLineString
  var featureMultiLineString = {
    type: "Feature",
    properties: {
      DN: 1
    },
    geometry: {
      type: "MultiLineString",
      coordinates: featureCoordinates
    }
  };

  var featureMultiLineStringKinks = kinks(featureMultiLineString);
  t.ok(featureMultiLineStringKinks, 'get self-intersection when vertex hits another side in a multi line string');
  t.equal(featureMultiLineStringKinks.features.length, 4);
  t.deepEqual(featureMultiLineStringKinks, expected);

  // Test MultiPolygon
  var featureMultiPolygon = {
    type: "Feature",
    properties: {
      DN: 1
    },
    geometry: {
      type: "MultiPolygon",
      coordinates: [featureCoordinates]
    }
  };

  var featureMultiPolygonKinks = kinks(featureMultiPolygon);
  t.ok(featureMultiPolygonKinks, 'get self-intersection when vertex hits another side in a multi polygon');
  t.equal(featureMultiPolygonKinks.features.length, 4);
  t.deepEqual(featureMultiPolygonKinks, expected);

  // Test Polygon
  var featurePolygon = {
    type: "Feature",
    properties: {
      DN: 1
    },
    geometry: {
      type: "Polygon",
      coordinates: featureCoordinates
    }
  };

  var featurePolygonKinks = kinks(featurePolygon);
  t.ok(featurePolygonKinks, 'get self-intersection when vertex hits another side in a polygon');
  t.equal(featurePolygonKinks.features.length, 4);
  t.deepEqual(featurePolygonKinks, expected);

  t.end();
});
