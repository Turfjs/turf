import * as GeojsonEquality from 'geojson-equality';
import cleanCoords from '../clean-coords';
import { getGeom } from '../invariant';
const GeoEquality = GeojsonEquality.default;

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
function booleanEqual(feature1, feature2) {
    const type1 = getGeom(feature1).type;
    const type2 = getGeom(feature2).type;
    if (type1 !== type2) return false;

    const equality = new GeoEquality({precision: 6});
    return equality.compare(cleanCoords(feature1), cleanCoords(feature2));
}

export default booleanEqual;
