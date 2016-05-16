var test = require('tape');
var buffer = require('../');
var fs = require('fs');
var glob = require('glob');
var featurecollection = require('turf-helpers').featureCollection;
var getBbox = require('turf-bbox');
var point = require('turf-helpers').point;
var distance = require('turf-distance');
var normalize = require('geojson-normalize');

test('buffer', function(t){
  var fixtures = glob.sync(__dirname+'/fixtures/in/*.geojson');
  fixtures.forEach(function(path){
    var fixture = JSON.parse(fs.readFileSync(path));
    var bbox = getBbox(fixture);
    var width = distance(
      point(bbox.slice(0,2)),
      point(bbox.slice(2,5)),
      'miles');
    if (!width) width = 1;
    var buffered = buffer(fixture, width * 0.1, 'miles');

    buffered = normalize(buffered);
    buffered.features = buffered.features.map(function(f) {
      f.properties = {
        'fill': '#000',
        'fill-opacity': 0.3,
        'stroke': '#0ff'
      };
      return f;
    });
 
    buffered.features = buffered.features.concat(normalize(fixture).features);
    if (process.env.REGEN) {
      fs.writeFileSync(
          __dirname+'/fixtures/out/'+path.split('/')[path.split('/').length-1],
          JSON.stringify(buffered, null, 2));
    }
    var expected = JSON.parse(fs.readFileSync(
        __dirname+'/fixtures/out/'+path.split('/')[path.split('/').length-1]));
    t.deepEqual(expected, buffered);
  });
  t.end();
});
