import { Feature, Geometry } from '@turf/helpers';
/**
 * Boolean-touches true if none of the points common to both geometries
 * intersect the interiors of both geometries.
 * @name booleanTouches
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 * var point = turf.point([1, 1]);
 *
 * turf.booleanTouches(point, line);
 * //=true
 */
declare function booleanTouches(feature1: Feature<any> | Geometry, feature2: Feature<any> | Geometry): boolean;
export default booleanTouches;
