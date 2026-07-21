import { Feature, Geometry } from "geojson";
import { booleanDisjoint } from "@turf/boolean-disjoint";

/**
 * Boolean-intersects returns (TRUE) if the intersection of the two geometries is NOT an empty set.
 *
 * @function
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.ignoreSelfIntersections=true] ignore self-intersections on input features
 * @returns {boolean} true if geometries intersect, false otherwise
 * @example
 * var point1 = turf.point([2, 2]);
 * var point2 = turf.point([1, 2]);
 * var line = turf.lineString([[1, 1], [1, 3], [1, 4]]);
 *
 * turf.booleanIntersects(line, point1);
 * //=false
 *
 * turf.booleanIntersects(line, point2);
 * //=true
 *
 * //addToMap
 * var addToMap = [point1, point2, line];
 * point1.properties['marker-color'] = '#f00'
 * point2.properties['marker-color'] = '#0f0'
 */
function booleanIntersects(
  feature1: Feature<any> | Geometry,
  feature2: Feature<any> | Geometry,
  {
    ignoreSelfIntersections = true,
  }: {
    ignoreSelfIntersections?: boolean;
  } = {}
) {
  // booleanDisjoint already compares every flattened geometry pair, so
  // intersects is simply its negation.
  return !booleanDisjoint(feature1, feature2, { ignoreSelfIntersections });
}

export { booleanIntersects };
export default booleanIntersects;
