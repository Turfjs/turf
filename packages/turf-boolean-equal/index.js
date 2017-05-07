var deepEqual = require('deep-equal');
var getCoords = require('@turf/invariant').getCoords;

/**
 * Equal returns True if two geometries of the same type have identical X,Y coordinate values.
 *
 * @name equal
 * @param {Geometry|Feature<any>} feature1 first geometry
 * @param {Geometry|Feature<any>} feature2 second geometry
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
module.exports = function (feature1, feature2) {
    // Check if geometry is the same type
    var type1 = geomType(feature1);
    var type2 = geomType(feature2);
    if (type1 !== type2) return false;

    // Check if coordinates are identical
    var coords1 = getCoords(feature1);
    var coords2 = getCoords(feature2);
    return deepEqual(coords1, coords2);
};

// This method should be replaced when implemented in @turf/invariant
function geomType(geojson) {
    return (geojson.geometry) ? geojson.geometry.type : geojson.type;
}
