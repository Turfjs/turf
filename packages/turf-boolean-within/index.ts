import { Feature, Geometry } from "geojson";
import { booleanContains } from "@turf/boolean-contains";

/**
 * Tests whether geometry a is contained by geometry b.
 * The interiors of both geometries must intersect, and the interior and boundary of geometry a must not intersect the exterior of geometry b.
 * booleanWithin(a, b) is equivalent to booleanContains(b, a)
 *
 * @function
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 * var point = turf.point([1, 2]);
 *
 * turf.booleanWithin(point, line);
 * //=true
 */
function booleanWithin(
  feature1: Feature<any> | Geometry,
  feature2: Feature<any> | Geometry
): boolean {
  return booleanContains(feature2, feature1);
}

export { booleanWithin };
export default booleanWithin;
