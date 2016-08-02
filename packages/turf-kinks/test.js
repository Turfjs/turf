var test = require('tape');
var kinks = require('./');

test('kinks', function(t){
  var hourglass = {
        type: "Polygon",
        coordinates: [
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
        ]
      };

  var hourglassKinks = kinks(hourglass);
  t.ok(hourglassKinks, 'get self intersection from hourglass polygon');
  t.deepEqual(hourglassKinks, {
    features: [ { geometry: { coordinates: [ -12.047632938440815, 8.885666404927512 ], type: 'Point' }, properties: {}, type: 'Feature' }, { geometry: { coordinates: [ -12.047632938440815, 8.885666404927512 ], type: 'Point' }, properties: {}, type: 'Feature' } ],
    type: 'FeatureCollection'
  });

  var triple = {
        type: "Polygon",
        coordinates: [
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
        ]
      };

  var tripleKinks = kinks(triple);
  t.ok(tripleKinks, 'get self intersection from triple intersecting polygon');
  t.equal(tripleKinks.features.length, 6);

  t.end();
});

test('kinks', function (t) {
  var feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
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
      ]
    }
  };
  var featureKinks = kinks(feature);

  t.ok(featureKinks, 'get self intersection from hourglass polygon feature');
  t.deepEqual(featureKinks, {
    features: [
      { geometry: { coordinates: [ -12.047632938440815, 8.885666404927512 ], type: 'Point' }, properties: {}, type: 'Feature' },
      { geometry: { coordinates: [ -12.047632938440815, 8.885666404927512 ], type: 'Point' }, properties: {}, type: 'Feature' } ],
    type: 'FeatureCollection'
  });

  t.end();
});


test('kinks', function (t) {
  var feature = {
    type: "Feature",
    properties: {
      DN: 1
    },
    geometry: {
      type: "Polygon",
      coordinates: [
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
      ]
    }
  };
  var featureKinks = kinks(feature);

  t.ok(featureKinks, 'get self-intersection when vertex hits another side');
  t.equal(featureKinks.features.length, 4);
  t.deepEqual(featureKinks, {
    type: 'FeatureCollection',
    features: [
      { geometry: { coordinates: [ 0.25, 0 ], type: 'Point' }, properties: {}, type: 'Feature' },
      { geometry: { coordinates: [ 0.5, 0 ], type: 'Point' }, properties: {}, type: 'Feature' },
      { geometry: { coordinates: [ 0.25, 0 ], type: 'Point' }, properties: {}, type: 'Feature' },
      { geometry: { coordinates: [ 0.5, 0 ], type: 'Point' }, properties: {}, type: 'Feature' }
    ]
  });


  t.end();
});
