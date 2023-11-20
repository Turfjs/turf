import rbush from "@turf/geojson-rbush";
import lineSegment from "@turf/line-segment";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import booleanPointOnLine from "@turf/boolean-point-on-line";
import booleanEqual from "@turf/boolean-equal";
import { getCoords } from "@turf/invariant";
import { featureEach, segmentEach } from "@turf/meta";
import {
  FeatureCollection,
  Feature,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";
import { featureCollection, isObject, lineString, point } from "@turf/helpers";
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
  G2 extends LineString | MultiLineString | Polygon | MultiPolygon,
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
  var features: Feature<LineString, GeoJsonProperties>[] = [];

  // Create Spatial Index
  var tree = rbush<LineString>();

  // To-Do -- HACK way to support typescript
  const line: any = lineSegment(line1);
  tree.load(line);

  // Iterate over line segments
  segmentEach(line2, function (segment) {
    if (!segment) {
      return;
    }

    // Iterate over each segments which falls within the same bounds
    featureEach(tree.search(segment), function (match) {
      var coordsSegment = getCoords(segment).sort();
      var coordsMatch = getCoords(match).sort();

      // Segment overlaps feature
      if (booleanEqual(segment, match)) {
        concatSegmentToFeatures(features, segment);
      } else {
        const segmentStartOnMatch = tolerance
          ? nearestPointOnLine(match, coordsSegment[0]).properties.dist <=
            tolerance
          : booleanPointOnLine(coordsSegment[0], match);
        const segmentEndOnMatch = tolerance
          ? nearestPointOnLine(match, coordsSegment[1]).properties.dist <=
            tolerance
          : booleanPointOnLine(coordsSegment[1], match);
        const matchStartOnSegment = tolerance
          ? nearestPointOnLine(segment, coordsMatch[0]).properties.dist <=
            tolerance
          : booleanPointOnLine(coordsMatch[0], segment);
        const matchEndOnSegment = tolerance
          ? nearestPointOnLine(segment, coordsMatch[1]).properties.dist <=
            tolerance
          : booleanPointOnLine(coordsMatch[1], segment);
        if (segmentStartOnMatch && segmentEndOnMatch) {
          concatSegmentToFeatures(features, segment);
        } else if (matchStartOnSegment && matchEndOnSegment) {
          concatSegmentToFeatures(features, match);
        } else {
          const from = segmentStartOnMatch
            ? coordsSegment[0]
            : segmentEndOnMatch
            ? coordsSegment[1]
            : undefined;
          const to = matchStartOnSegment
            ? coordsMatch[0]
            : matchEndOnSegment
            ? coordsMatch[1]
            : undefined;
          if (from && to) {
            const isSame = tolerance
              ? nearestPointOnLine(lineString([from, from]), to).properties
                  .dist <= tolerance
              : booleanEqual(point(from), point(to));
            if (!isSame) {
              concatSegmentToFeatures(features, lineString([from, to]));
            }
          }
        }
      }
    });
  });
  return featureCollection(features);
}

/**
 * Add segment to list of linestrings
 *
 * @private
 * @param {Feature<LineString, GeoJsonProperties>[]} features Existing list
 * @param {Feature<LineString>} segment 2-vertex LineString to add to list
 */
function concatSegmentToFeatures(
  features: Feature<LineString, GeoJsonProperties>[],
  segment: Feature<LineString>
): void {
  for (let i = features.length - 1; i >= 0; i--) {
    if (concatSegment(features[i], segment)) {
      return;
    }
  }
  features.push(segment);
}

/**
 * Concat Segment
 *
 * @private
 * @param {Feature<LineString>} line LineString
 * @param {Feature<LineString>} segment 2-vertex LineString
 * @returns {Feature<LineString> | void} concat linestring or nothing if no suitable place could be found in linestring
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
  else return; // If the overlap leaves the segment unchanged, return undefined so that this can be identified.

  // Otherwise return the mutated line.
  return line;
}

export default lineOverlap;
