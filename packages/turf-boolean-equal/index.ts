import GeojsonEquality from 'geojson-equality';
import cleanCoords from '@turf/clean-coords';
import { getType } from '@turf/invariant';
import { Feature, Geometry } from '@turf/helpers';

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
function booleanEqual<G1 extends Geometry, G2 extends Geometry>(feature1: Feature<G1> | G1, feature2: Feature<G2> | G2): boolean {
    // validation
    if (!feature1) throw new Error('feature1 is required');
    if (!feature2) throw new Error('feature2 is required');
    var type1 = getType(feature1);
    var type2 = getType(feature2);
    if (type1 !== type2) return false;

    var equality = new GeojsonEquality({precision: 6});
    return equality.compare(cleanCoords(feature1), cleanCoords(feature2));
}

export default booleanEqual;
