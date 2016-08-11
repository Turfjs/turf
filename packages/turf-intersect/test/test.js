var intersect = require('../'),
  test = require('tape'),
  glob = require('glob'),
  fs = require('fs');

var REGEN = true;

test('intersect -- features', function(t){
  glob.sync(__dirname + '/fixtures/in/*.json').forEach(function(input) {
      var features = JSON.parse(fs.readFileSync(input));
      var output = intersect(features[0], features[1]);
      if (REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});

test('intersect -- geometries', function(t){
  glob.sync(__dirname + '/fixtures/in/*.json').forEach(function(input) {
      var features = JSON.parse(fs.readFileSync(input));
      var output = intersect(features[0].geometry, features[1].geometry);
      if (REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
      t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});

test('intersect -- no overlap', function(t){
  var noOverlap = JSON.parse(fs.readFileSync(__dirname+'/fixtures/no-overlap.geojson'));
  var output = intersect(noOverlap[0].geometry, noOverlap[1].geometry);
  t.deepEqual(output, undefined);
  t.end();
});

test('intersect -- polygons', function(t) {
  var square = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [-10, 24],
          [-10, 64],
          [50, 64],
          [50, 24],
          [-10, 24]
        ]
      ]
    }
  };

  var triangle = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [12, 40],
          [38, 54],
          [74, 36],
          [12, 40]
        ]
      ]
    }
  };

  var output = intersect(square, triangle);

  /*
  {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [50, 48],
          [50, 37.54838709677419],
          [12, 40],
          [38, 54],
          [50, 48]
        ]
      ]
    }
  }
  */

  console.log(JSON.stringify(output, null, 2))
  t.end();
});

test('intersect -- long lines', function(t) {
  var lineA = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [50, 64],
        [50, 24]
      ]
    }
  };

  var lineB = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [38, 54],
        [74, 36]
      ]
    }
  };

  var output = intersect(lineA, lineB);

  /*
  {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [
        50,
        48
      ]
    }
  }
  */

  console.log(JSON.stringify(output, null, 2))
  t.end();
});

test('intersect -- short lines', function(t) {
  var lineA = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [-470.9309506416321, 32.21328216842315],
        [-470.93092918395996, 32.21149391443225]
      ]
    }
  };

  var lineB = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [-470.9330105781555, 32.21240166196934],
        [-470.9285581111908, 32.212392584538826]
      ]
    }
  };

  var output = intersect(lineA, lineB);

  /*
  {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [
        -470.93094002557945,
        32.21239744064725
      ]
    }
  }
  */

  console.log(JSON.stringify(output, null, 2))
  t.end();
});
