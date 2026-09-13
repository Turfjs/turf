import intersect from "@turf/intersect";
import area from "@turf/area";
import {
  feature,
  featureCollection,
  isObject,
} from "@turf/helpers";
import {
  Feature,
  Polygon,
  MultiPolygon,
} from "geojson";
import * as invariant from "@turf/invariant";

/**
 * Checks if the intersection area between a target polygon (targetPolygon)
 * and a test polygon (testPolygon) is greater than or equal to a specified
 * threshold percentage of the test polygon's *own* area.
 *
 * @name intersectByAreaPercentage
 * @param {Feature<Polygon|MultiPolygon>|Polygon|MultiPolygon} targetPolygon The target polygon feature.
 * @param {Feature<Polygon|MultiPolygon>|Polygon|MultiPolygon} testPolygon The test polygon feature whose intersection area is being evaluated.
 * @param {number} threshold The minimum required percentage (from 0.0 to 1.0) of testPolygon's area that must be inside targetPolygon.
 * @returns {boolean} True if the ratio (intersectionArea / testPolygonArea) is >= threshold.
 *                  Returns false if inputs are invalid, threshold is invalid, testPolygon has zero area and threshold > 0,
 *                  or if an error occurs during calculation. Returns true if threshold is 0 and polygons do not intersect
 *                  or if testPolygon has zero area.
 * @example
 * const poly1 = turf.polygon([[[-10, -10], [10, -10], [10, 10], [-10, 10], [-10, -10]]]);
 * const poly2 = turf.polygon([[[0, 0], [20, 0], [20, 20], [0, 20], [0, 0]]]); // Overlaps 1/4 (25%) of poly1
 * const poly3 = turf.polygon([[[-5, -5], [5, -5], [5, 5], [-5, 5], [-5, -5]]]); // Fully contained in poly1
 *
 * turf.intersectByAreaPercentage(poly1, poly2, 0.25); // => true (intersection is 100 area units, poly2 is 400 area units => 100/400 = 0.25)
 * turf.intersectByAreaPercentage(poly1, poly2, 0.26); // => false
 * turf.intersectByAreaPercentage(poly1, poly3, 0.99); // => true (intersection is 100% of poly3's area)
 * turf.intersectByAreaPercentage(poly1, poly3, 0.0); // => true
 */
function intersectByAreaPercentage(
  targetPolygon: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon,
  testPolygon: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon,
  threshold: number
): boolean {
  // Basic validation
  if (!targetPolygon || !testPolygon || typeof threshold !== "number" || threshold < 0 || threshold > 1) {
    return false;
  }

  // Use invariant.getGeom().type for safer type checking
  let targetType: string;
  let testType: string;
  try {
    targetType = invariant.getGeom(targetPolygon).type;
    testType = invariant.getGeom(testPolygon).type;
  } catch (e) {
    return false; // Invalid geometry input
  }

  if (
    (targetType !== "Polygon" && targetType !== "MultiPolygon") ||
    (testType !== "Polygon" && testType !== "MultiPolygon")
  ) {
    return false;
  }

  try {
    const testPolygonArea = area(testPolygon);

    // Handle zero area test polygon
    if (testPolygonArea === 0) {
      return threshold === 0;
    }

    // Ensure inputs are valid Features for intersect.
    // intersect expects Feature<Polygon | MultiPolygon>.
    let targetFeature: Feature<Polygon | MultiPolygon>;
    let testFeature: Feature<Polygon | MultiPolygon>;

    try {
      const targetGeom = invariant.getGeom(targetPolygon);
      const testGeom = invariant.getGeom(testPolygon);

      // Re-check types after getting geometry
      if ((targetGeom.type !== "Polygon" && targetGeom.type !== "MultiPolygon") || (testGeom.type !== "Polygon" && testGeom.type !== "MultiPolygon")) {
        return false;
      }

      // If original input was Geometry, wrap in Feature. Otherwise, use the Feature.
      targetFeature = targetGeom === targetPolygon ? feature(targetGeom) : targetPolygon as Feature<Polygon | MultiPolygon>;
      testFeature = testGeom === testPolygon ? feature(testGeom) : testPolygon as Feature<Polygon | MultiPolygon>;

    } catch (e) {
      return false; // Error during geometry retrieval or type check
    }

    const fc = featureCollection([targetFeature, testFeature]);

    const intersectionResult = intersect(fc);

    // No intersection or only touch
    if (intersectionResult === null) {
      return threshold === 0;
    }

    const intersectionArea = area(intersectionResult);

    // Handle zero area intersection (e.g., linear touch)
    if (intersectionArea === 0) {
      return threshold === 0;
    }

    // Calculate overlap ratio relative to testPolygon's area
    const overlapRatio = intersectionArea / testPolygonArea;

    return overlapRatio >= threshold;
  } catch (e) {
    // Treat calculation errors as 'condition not met'
    // console.error(`Error during intersect/area calculation: ${e.message}`);
    return false;
  }
}

export default intersectByAreaPercentage; 