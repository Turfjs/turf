import {
  feature,
  Feature,
  featureCollection,
  FeatureCollection,
  LineString,
  MultiLineString,
  MultiPolygon,
  point,
  Point,
  Polygon,
} from "@turf/helpers";

import findIntersections from "sweepline-intersections";

/**
 * Takes any LineString or Polygon GeoJSON and returns the intersecting point(s).
 *
 * @name lineIntersect
 * @param {GeoJSON} line1 any LineString or Polygon
 * @param {GeoJSON} line2 any LineString or Polygon
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.removeDuplicates=true] remove duplicate intersections
 * @returns {FeatureCollection<Point>} point(s) that intersect both
 * @example
 * var line1 = turf.lineString([[126, -11], [129, -21]]);
 * var line2 = turf.lineString([[123, -18], [131, -14]]);
 * var intersects = turf.lineIntersect(line1, line2);
 *
 * //addToMap
 * var addToMap = [line1, line2, intersects]
 */
function lineIntersect<
  G1 extends LineString | MultiLineString | Polygon | MultiPolygon,
  G2 extends LineString | MultiLineString | Polygon | MultiPolygon
>(
  line1: FeatureCollection<G1> | Feature<G1> | G1,
  line2: FeatureCollection<G2> | Feature<G2> | G2,
  options: {
    removeDuplicates?: boolean;
  } = {}
): FeatureCollection<Point> {
  let removeDuplicates = true;
  if ("removeDuplicates" in options) {
    removeDuplicates = options.removeDuplicates;
  }

  let features = [];
  if (line1.type === "FeatureCollection")
    features = features.concat(line1.features);
  else if (line1.type === "Feature") features.push(line1);
  else if (
    line1.type === "LineString" ||
    line1.type === "Polygon" ||
    line1.type === "MultiLineString" ||
    line1.type === "MultiPolygon"
  ) {
    features.push(feature(line1));
  }

  if (line2.type === "FeatureCollection")
    features = features.concat(line2.features);
  else if (line2.type === "Feature") features.push(line2);
  else if (
    line2.type === "LineString" ||
    line2.type === "Polygon" ||
    line2.type === "MultiLineString" ||
    line2.type === "MultiPolygon"
  ) {
    features.push(feature(line2));
  }

  const intersections = findIntersections(featureCollection(features));
  let results = [];
  if (removeDuplicates) {
    const unique = {};
    intersections.forEach((intersection) => {
      const key = intersection.join(",");
      if (!unique[key]) {
        unique[key] = true;
        results.push(intersection);
      }
    });
  } else {
    results = intersections;
  }
  return featureCollection(results.map((r) => point(r)));
}

export default lineIntersect;
