var GeojsonEquality = require('geojson-equality');
var cleanCoords = require('@turf/clean-coords');
var invariant = require('@turf/invariant');
var getGeomType = invariant.getGeomType;

/**
 * Determine whether two geometries of the same type have identical X,Y coordinate values.
 * See http://edndoc.esri.com/arcsde/9.0/general_topics/understand_spatial_relations.htm
 *
 * @name booleanEqual
 * @param {Geometry|Feature} feature1 GeoJSON input
 * @param {Geometry|Feature} feature2 GeoJSON input
 * @returns {boolean} true if the objects are equal, false otherwise
 * @example
 * var pt1 = turf.point([0, 0]);
 * var pt2 = turf.point([0, 0]);
 * var pt3 = turf.point([1, 1]);
 *
 * turf.booleanEqual(pt1, pt2);
 * //= true
 * turf.booleanEqual(pt2, pt3);
 * //= false
 */
module.exports = function (feature1, feature2) {
    // validation
    if (!feature1) throw new Error('feature1 is required');
    if (!feature2) throw new Error('feature2 is required');
    var type1 = getGeomType(feature1);
    var type2 = getGeomType(feature2);
    if (type1 !== type2) return false;

    var equality = new GeojsonEquality({precision: 6});
    return equality.compare(cleanCoords(feature1), cleanCoords(feature2));
};
