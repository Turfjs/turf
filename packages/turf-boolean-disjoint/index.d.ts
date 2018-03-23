import { Feature, Geometry } from "@turf/helpers";
/**
 * Boolean-disjoint returns (TRUE) if the intersection of the two geometries is an empty set.
 *
 * @name booleanDisjoint
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var point = turf.point([2, 2]);
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 *
 * turf.booleanDisjoint(line, point);
 * //=true
 */
declare function booleanDisjoint(feature1: Feature<any> | Geometry, feature2: Feature<any> | Geometry): boolean;
export default booleanDisjoint;
