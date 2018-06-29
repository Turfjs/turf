import { Feature, Geometry } from "@turf/helpers";
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
export default function booleanIntersects(feature1: Feature<any> | Geometry, feature2: Feature<any> | Geometry): boolean;
