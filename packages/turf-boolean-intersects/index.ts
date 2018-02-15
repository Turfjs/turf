import { flattenEach } from '@turf/meta';
import booleanDisjoint from '@turf/boolean-disjoint';

/**
 * Boolean-intersects returns (TRUE) two geometries intersect.
 *
 * @name booleanIntersects
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var point = turf.point([2, 2]);
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 *
 * turf.booleanIntersects(line, point);
 * //=true
 */
function booleanIntersects(feature1, feature2) {
    var boolean;
    flattenEach(feature1, function (flatten1) {
        flattenEach(feature2, function (flatten2) {
            if (boolean === true) return true;
            boolean = !booleanDisjoint(flatten1.geometry, flatten2.geometry);
        });
    });
    return boolean;
}

export default booleanIntersects;
