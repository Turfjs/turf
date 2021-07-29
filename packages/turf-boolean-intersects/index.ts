import { Feature, Geometry } from "geojson";
import booleanDisjoint from "@turf/boolean-disjoint";
import { flattenEach } from "@turf/meta";

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
export default function booleanIntersects(
  feature1: Feature<any> | Geometry,
  feature2: Feature<any> | Geometry
) {
  let bool = false;
  flattenEach(feature1, (flatten1) => {
    flattenEach(feature2, (flatten2) => {
      if (bool === true) {
        return true;
      }
      bool = !booleanDisjoint(flatten1.geometry, flatten2.geometry);
    });
  });
  return bool;
}
