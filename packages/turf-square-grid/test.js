var test = require('tape');
var grid = require('./');
var fs = require('fs');

test('square-grid', function (t) {
  var bbox1 = [
        -96.6357421875,
        31.12819929911196,
        -84.9462890625,
        40.58058466412764
      ];
  var bbox2 = [
          -81.650390625,
          24.926294766395593,
          -79.8486328125,
          26.43122806450644
        ];
  var bbox3 = [
        -77.3876953125,
        38.71980474264239,
        -76.9482421875,
        39.027718840211605
      ];
  var bbox4 = [
    63.6328125,
    11.867350911459308,
    75.234375,
    47.754097979680026
  ];

  var grid1 = grid(bbox1, 20, 'miles');
  var grid2 = grid(bbox2, 5, 'miles');
  var grid3 = grid(bbox3, 2, 'miles');
  var grid4 = grid(bbox4, 50, 'miles');

  t.ok(grid1.features.length);
  t.ok(grid2.features.length);
  t.ok(grid3.features.length);
  t.ok(grid4.features.length);

  fs.writeFileSync(__dirname+'/fixtures/out/grid1.geojson', JSON.stringify(grid1,null,2));
  fs.writeFileSync(__dirname+'/fixtures/out/grid2.geojson', JSON.stringify(grid2,null,2));
  fs.writeFileSync(__dirname+'/fixtures/out/grid3.geojson', JSON.stringify(grid3,null,2));
  fs.writeFileSync(__dirname+'/fixtures/out/grid4.geojson', JSON.stringify(grid4,null,2));

  t.end();
});