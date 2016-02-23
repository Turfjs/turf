var test = require('tape');
var center = require('./');
var fs = require('fs');

var boxFC = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/box.geojson'));
var blockFC = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/block.geojson'));

test('center', function(t){
  var boxFcCenter = center(boxFC);
  boxFcCenter.properties['marker-color'] = '#f0f';
  t.ok(boxFcCenter, 'should return the proper center for a FeatureCollection');
  t.deepEqual(boxFcCenter.geometry.coordinates, [65.56640625, 43.59448261855401]);

  var blockFcCenter = center(blockFC.features[0]);
  blockFcCenter.properties['marker-color'] = '#f0f';
  t.ok(blockFcCenter, 'should return the proper center for a FeatureCollection');
  t.deepEqual(blockFcCenter.geometry.coordinates, [ -114.02911397119072, 51.050271120392566]);

  boxFC.features.push(boxFcCenter);
  blockFC.features.push(blockFcCenter);
  fs.writeFileSync(__dirname+'/fixtures/out/box_out.geojson', JSON.stringify(boxFC,null,2));
  fs.writeFileSync(__dirname+'/fixtures/out/block_out.geojson', JSON.stringify(blockFC,null,2));

  t.end();
});
