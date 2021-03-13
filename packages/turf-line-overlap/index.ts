import rbush from "geojson-rbush";
import lineSegment from "@turf/line-segment";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import booleanPointOnLine from "@turf/boolean-point-on-line";
import { getCoords } from "@turf/invariant";
import { featureEach, segmentEach } from "@turf/meta";
import {
  featureCollection,
  isObject,
  FeatureCollection,
  Feature,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  Properties,
} from "@turf/helpers";
import equal from "deep-equal";

/**
 * Takes any LineString or Polygon and returns the overlapping lines between both features.
 *
 * @name lineOverlap
 * @param {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} line1 any LineString or Polygon
 * @param {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} line2 any LineString or Polygon
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.tolerance=0] Tolerance distance to match overlapping line segments (in kilometers)
 * @returns {FeatureCollection<LineString>} lines(s) that are overlapping between both features
 * @example
 * var line1 = turf.lineString([[115, -35], [125, -30], [135, -30], [145, -35]]);
 * var line2 = turf.lineString([[115, -25], [125, -30], [135, -30], [145, -25]]);
 *
 * var overlapping = turf.lineOverlap(line1, line2);
 *
 * //addToMap
 * var addToMap = [line1, line2, overlapping]
 */
function lineOverlap<
  G1 extends LineString | MultiLineString | Polygon | MultiPolygon,
  G2 extends LineString | MultiLineString | Polygon | MultiPolygon
>(
  line1: Feature<G1> | G1,
  line2: Feature<G2> | G2,
  options: { tolerance?: number } = {}
): FeatureCollection<LineString> {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var tolerance = options.tolerance || 0;

  // Containers
  var features: Feature<LineString, Properties>[] = [];

  // Create Spatial Index
  var tree = rbush();

  // To-Do -- HACK way to support typescript
  const line: any = lineSegment(line1);
  tree.load(line);
  var overlapSegment: Feature<LineString> | undefined;

  // Line Intersection

  // Iterate over line segments
  segmentEach(line2, function (segment) {
    var doesOverlaps = false;

    if (!segment) {
      return;
    }

    // Iterate over each segments which falls within the same bounds
    featureEach(tree.search(segment), function (match) {
      if (doesOverlaps === false) {
        var coordsSegment = getCoords(segment).sort();
        var coordsMatch: any = getCoords(match).sort();

        // Segment overlaps feature
        if (equal(coordsSegment, coordsMatch)) {
          doesOverlaps = true;
          // Overlaps already exists - only append last coordinate of segment
          if (overlapSegment)
            overlapSegment = concatSegment(overlapSegment, segment);
          else overlapSegment = segment;
          // Match segments which don't share nodes (Issue #901)
        } else if (
          tolerance === 0
            ? booleanPointOnLine(coordsSegment[0], match) &&
              booleanPointOnLine(coordsSegment[1], match)
            : nearestPointOnLine(match, coordsSegment[0]).properties.dist! <=
                tolerance &&
              nearestPointOnLine(match, coordsSegment[1]).properties.dist! <=
                tolerance
        ) {
          doesOverlaps = true;
          if (overlapSegment)
            overlapSegment = concatSegment(overlapSegment, segment);
          else overlapSegment = segment;
        } else if (
          tolerance === 0
            ? booleanPointOnLine(coordsMatch[0], segment) &&
              booleanPointOnLine(coordsMatch[1], segment)
            : nearestPointOnLine(segment, coordsMatch[0]).properties.dist! <=
                tolerance &&
              nearestPointOnLine(segment, coordsMatch[1]).properties.dist! <=
                tolerance
        ) {
          // Do not define (doesOverlap = true) since more matches can occur within the same segment
          // doesOverlaps = true;
          if (overlapSegment)
            overlapSegment = concatSegment(overlapSegment, match);
          else overlapSegment = match;
        }
      }
    });

    // Segment doesn't overlap - add overlaps to results & reset
    if (doesOverlaps === false && overlapSegment) {
      features.push(overlapSegment);
      overlapSegment = undefined;
    }
  });
  // Add last segment if exists
  if (overlapSegment) features.push(overlapSegment);

  return featureCollection(features);
}

/**
 * Concat Segment
 *
 * @private
 * @param {Feature<LineString>} line LineString
 * @param {Feature<LineString>} segment 2-vertex LineString
 * @returns {Feature<LineString>} concat linestring
 */
function concatSegment(
  line: Feature<LineString>,
  segment: Feature<LineString>
) {
  var coords = getCoords(segment);
  var lineCoords = getCoords(line);
  var start = lineCoords[0];
  var end = lineCoords[lineCoords.length - 1];
  var geom = line.geometry.coordinates;

  if (equal(coords[0], start)) geom.unshift(coords[1]);
  else if (equal(coords[0], end)) geom.push(coords[1]);
  else if (equal(coords[1], start)) geom.unshift(coords[0]);
  else if (equal(coords[1], end)) geom.push(coords[0]);
  return line;
}

export default lineOverlap;
