import { segmentEach } from "@turf/meta";
import { getGeom } from "@turf/invariant";
import lineOverlap from "@turf/line-overlap";
import lineIntersect from "@turf/line-intersect";
import GeojsonEquality from "geojson-equality";
import { Feature, Geometry, MultiPoint } from "@turf/helpers";

/**
 * Compares two geometries of the same dimension and returns true if their intersection set results in a geometry
 * different from both but of the same dimension. It applies to Polygon/Polygon, LineString/LineString,
 * Multipoint/Multipoint, MultiLineString/MultiLineString and MultiPolygon/MultiPolygon.
 *
 * @name booleanOverlap
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature1 input
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature2 input
 * @returns {boolean} true/false
 * @example
 * var poly1 = turf.polygon([[[0,0],[0,5],[5,5],[5,0],[0,0]]]);
 * var poly2 = turf.polygon([[[1,1],[1,6],[6,6],[6,1],[1,1]]]);
 * var poly3 = turf.polygon([[[10,10],[10,15],[15,15],[15,10],[10,10]]]);
 *
 * turf.booleanOverlap(poly1, poly2)
 * //=true
 * turf.booleanOverlap(poly2, poly3)
 * //=false
 */
export default function booleanOverlap(
  feature1: Feature<any> | Geometry,
  feature2: Feature<any> | Geometry
): boolean {
  const geom1 = getGeom(feature1);
  const geom2 = getGeom(feature2);
  const type1 = geom1.type;
  const type2 = geom2.type;

  if (
    (type1 === "MultiPoint" && type2 !== "MultiPoint") ||
    ((type1 === "LineString" || type1 === "MultiLineString") &&
      type2 !== "LineString" &&
      type2 !== "MultiLineString") ||
    ((type1 === "Polygon" || type1 === "MultiPolygon") &&
      type2 !== "Polygon" &&
      type2 !== "MultiPolygon")
  ) {
    throw new Error("features must be of the same type");
  }
  if (type1 === "Point") throw new Error("Point geometry not supported");

  // features must be not equal
  const equality = new GeojsonEquality({ precision: 6 });
  if (equality.compare(feature1, feature2)) return false;

  let overlap = 0;

  switch (type1) {
    case "MultiPoint":
      for (var i = 0; i < (geom1 as MultiPoint).coordinates.length; i++) {
        for (var j = 0; j < (geom2 as MultiPoint).coordinates.length; j++) {
          var coord1 = geom1.coordinates[i];
          var coord2 = geom2.coordinates[j];
          if (coord1[0] === coord2[0] && coord1[1] === coord2[1]) {
            return true;
          }
        }
      }
      return false;

    case "LineString":
    case "MultiLineString":
      segmentEach(feature1, (segment1) => {
        segmentEach(feature2, (segment2) => {
          if (lineOverlap(segment1!, segment2!).features.length) overlap++;
        });
      });
      break;

    case "Polygon":
    case "MultiPolygon":
      segmentEach(feature1, (segment1) => {
        segmentEach(feature2, (segment2) => {
          if (lineIntersect(segment1!, segment2!).features.length) overlap++;
        });
      });
      break;
  }

  return overlap > 0;
}
