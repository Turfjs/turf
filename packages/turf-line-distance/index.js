var distance = require('turf-distance');
var point = require('turf-helpers').point;

/**
 * Takes a {@link LineString|line} and measures its length in the specified units.
 *
 * @name lineDistance
 * @param {Feature<LineString>} line line to measure
 * @param {String} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @return {Number} length of the input line
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [-77.031669, 38.878605],
 *       [-77.029609, 38.881946],
 *       [-77.020339, 38.884084],
 *       [-77.025661, 38.885821],
 *       [-77.021884, 38.889563],
 *       [-77.019824, 38.892368]
 *     ]
 *   }
 * };
 *
 * var length = turf.lineDistance(line, 'miles');
 *
 * //=line
 *
 * //=length
 */
module.exports = function lineDistance(line, units) {
    if (line.type === 'FeatureCollection') {
        return line.features.reduce(function (memo, feature) {
            return memo + lineDistance(feature, units);
        }, 0);
    }

    var geometry = line.type === 'Feature' ? line.geometry : line;
    var d, i;

    if (geometry.type === 'LineString') {
        return length(geometry.coordinates, units);
    } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
        d = 0;
        for (i = 0; i < geometry.coordinates.length; i++) {
            d += length(geometry.coordinates[i], units);
        }
        return d;
    } else if (line.type === 'MultiPolygon') {
        d = 0;
        for (i = 0; i < geometry.coordinates.length; i++) {
            for (var j = 0; j < geometry.coordinates[i].length; j++) {
                d += length(geometry.coordinates[i][j], units);
            }
        }
        return d;
    } else {
        throw new Error('input must be a LineString, MultiLineString, ' +
            'Polygon, or MultiPolygon Feature or Geometry (or a FeatureCollection ' +
            'containing only those types)');
    }

};

function length(coords, units) {
    var travelled = 0;
    var prevCoords = point(coords[0]);
    var curCoords = point(coords[0]);
    var temp;
    for (var i = 1; i < coords.length; i++) {
        curCoords.geometry.coordinates = coords[i];
        travelled += distance(prevCoords, curCoords, units);
        temp = prevCoords;
        prevCoords = curCoords;
        curCoords = temp;
    }
    return travelled;
}
