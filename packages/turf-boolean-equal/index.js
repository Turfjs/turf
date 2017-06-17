var rewind = require('@turf/rewind');
var deepEqual = require('deep-equal');
var truncate = require('@turf/truncate');
var getCoords = require('@turf/invariant').getCoords;

/**
 * Equal returns True if two geometries of the same type have identical X,Y coordinate values.
 *
 * @name equal
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @param {Boolean} [direction=false] direction of LineString or Polygon (orientation) is ignored if false
 * @param {number} [precision] coordinate decimal precision
 * @returns {Boolean} true/false
 * @example
 * const point1 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [1, 1]
 *   }
 * }
 * const point2 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [1, 1]
 *   }
 * }
 * var equal = turf.equal(point1, point2);
 * //=true
 */
module.exports = function (feature1, feature2, direction, precision) {
    // Check if geometry is the same type
    var type1 = geomType(feature1);
    var type2 = geomType(feature2);
    if (type1 !== type2) return false;

    // Truncate coordinate decimals based on precision
    if (precision !== undefined) {
        feature1 = truncate(feature1, precision);
        feature2 = truncate(feature2, precision);
    }

    // direction of LineString or Polygon (orientation) is ignored if false
    if (direction) {
        feature1 = rewind(feature1);
        feature2 = rewind(feature2);
    }

    // Check if coordinates are identical
    var coords1 = getCoords(feature1);
    var coords2 = getCoords(feature2);
    return deepEqual(coords1, coords2);
};

// This method should be replaced when implemented in @turf/invariant
function geomType(geojson) {
    return (geojson.geometry) ? geojson.geometry.type : geojson.type;
}
