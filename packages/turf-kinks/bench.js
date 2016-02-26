var kinks = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var hourglass = {
    "type": "Polygon",
    "coordinates": [
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

var triple = {
        "type": "Polygon",
        "coordinates": [
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

var suite = new Benchmark.Suite('turf-kinks');
suite
  .add('turf-kinks##hourglass',function () {
    kinks(hourglass);
  })
  .add('turf-kinks##triple',function () {
    kinks(triple);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();