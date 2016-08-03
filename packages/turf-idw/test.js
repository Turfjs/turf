var test = require('tape');
var idw = require('./');
var fs = require('fs');

test('idw', function (t) {
  var testPoints = JSON.parse(fs.readFileSync('./data/data.geojson'));

  var idw1 = idw(testPoints,'value' , 0.5 , 1, 'kilometers');
  var idw2 = idw(testPoints,'value', 0.5 ,0.5, 'kilometers');
  var idw3 = idw(testPoints,'value', 2 , 1, 'miles');
  var idw4 = idw(testPoints, 'WRONGDataField', 0.5, 1, 'miles');

  t.ok(idw1.features.length);
  t.ok(idw2.features.length);
  t.ok(idw3.features.length);
  t.error(idw4);

  if (process.env.UPDATE) {
    fs.writeFileSync(__dirname+'/tests/idw1.geojson', JSON.stringify(idw1,null,2));
    fs.writeFileSync(__dirname+'/tests/idw2.geojson', JSON.stringify(idw2,null,2));
    fs.writeFileSync(__dirname+'/tests/idw3.geojson', JSON.stringify(idw3,null,2));
  }

  t.end();
});
