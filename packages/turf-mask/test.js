var mask = require('./');
var test = require('tape');
var poly = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
        'type': 'Polygon',
        'coordinates': [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]]]
    }
};

var maskPoly = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
        'type': 'Polygon',
        'coordinates': [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
    }
};


var maskedOutputWorld = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]],
          [[180, 90], [-180, 90], [-180, -90], [180, -90], [180, 90]]
        ]
    }
};

var maskedOutputSpecific = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]],
          [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
        ]
    }
};

test('turf collect module', function (t) {
    var maskedWithNoMask = mask(poly);
    t.deepEqual(maskedWithNoMask, maskedOutputWorld, 'Masks to the world');
    // Reset the input poly by removing the mask
    poly.geometry.coordinates.splice(1, 1);

    var maskedWithInput = mask(poly, maskPoly);
    t.deepEqual(maskedWithInput, maskedOutputSpecific, 'Masks to a specific poly');

    t.end();
});
