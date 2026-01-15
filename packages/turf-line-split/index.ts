import { geojsonRbush as rbush } from "@turf/geojson-rbush";
import { truncate } from "@turf/truncate";
import { lineSegment } from "@turf/line-segment";
import { lineIntersect } from "@turf/line-intersect";
import { nearestPointOnLine } from "@turf/nearest-point-on-line";
import { getCoords, getCoord, getType } from "@turf/invariant";
import { featureEach, featureReduce, flattenEach } from "@turf/meta";
import { lineString, featureCollection, feature } from "@turf/helpers";
import {
  Feature,
  FeatureCollection,
  GeoJsonTypes,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

type Splitter = Feature<
  Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon
>;

/**
 * Split a LineString by another GeoJSON Feature.
 *
 * @function
 * @param {Feature<LineString>} line LineString Feature to split
 * @param {Feature<any>} splitter Feature used to split line
 * @returns {FeatureCollection<LineString>} Split LineStrings
 * @example
 * var line = turf.lineString([[120, -25], [145, -25]]);
 * var splitter = turf.lineString([[130, -15], [130, -35]]);
 *
 * var split = turf.lineSplit(line, splitter);
 *
 * //addToMap
 * var addToMap = [line, splitter, split]
 *
 * split.features[0].properties.stroke = "red";
 * split.features[1].properties.stroke = "blue";
 */
function lineSplit<T extends LineString>(
  line: Feature<T> | T,
  splitter: Splitter
): FeatureCollection<T> {
  if (!line) throw new Error("line is required");
  if (!splitter) throw new Error("splitter is required");

  const lineType = getType(line) as Exclude<GeoJsonTypes, "Feature">;
  const splitterType = getType(splitter) as Exclude<GeoJsonTypes, "Feature">;

  if (lineType !== "LineString") throw new Error("line must be LineString");
  if (splitterType === "FeatureCollection")
    throw new Error("splitter cannot be a FeatureCollection");
  if (splitterType === "GeometryCollection")
    throw new Error("splitter cannot be a GeometryCollection");

  // remove excessive decimals from splitter
  // to avoid possible approximation issues in rbush
  var truncatedSplitter = truncate(splitter, { precision: 7 });

  // Ensure we're consistently sending Feature<LineString> into the splitLine methods.
  if (line.type !== "Feature") {
    line = feature(line);
  }

  switch (splitterType) {
    case "Point":
      return splitLineWithPoint(
        line as Feature<LineString>,
        truncatedSplitter as Feature<Point>
      ) as FeatureCollection<T>;
    case "MultiPoint":
      return splitLineWithPoints(
        line as Feature<LineString>,
        truncatedSplitter as Feature<MultiPoint>
      ) as FeatureCollection<T>;
    case "LineString":
    case "MultiLineString":
    case "Polygon":
    case "MultiPolygon":
      return splitLineWithPoints(
        line as Feature<LineString>,
        lineIntersect(
          line,
          truncatedSplitter as Feature<
            LineString | MultiLineString | Polygon | MultiPolygon
          >,
          {
            ignoreSelfIntersections: true,
          }
        )
      ) as FeatureCollection<T>;
  }
}

/**
 * Split LineString with MultiPoint
 *
 * @private
 * @param {Feature<LineString>} line LineString
 * @param {FeatureCollection<Point>} splitter Point
 * @returns {FeatureCollection<LineString>} split LineStrings
 */
function splitLineWithPoints(
  line: Feature<LineString>,
  splitter: FeatureCollection<Point> | Feature<MultiPoint>
) {
  var results: Feature<LineString>[] = [];
  var tree = rbush<LineString>();

  flattenEach(
    splitter as FeatureCollection<Point>, // this cast should be unnecessary (and is wrong, it could contain MultiPoints), but is a workaround for bad flattenEach typings
    function (point: Feature<Point>) {
      // Add index/id to features (needed for filter)
      results.forEach(function (feature, index) {
        feature.id = index;
      });
      // First Point - doesn't need to handle any previous line results
      if (!results.length) {
        results = splitLineWithPoint(line, point).features;
        tree.load(featureCollection(results));
        // Split with remaining points - lines might needed to be split multiple times
      } else {
        // Find all lines that are within the splitter's bbox
        var search = tree.search(point);

        if (search.features.length) {
          // RBush might return multiple lines - only process the closest line to splitter
          var closestLine = findClosestFeature(point, search);

          // Remove closest line from results since this will be split into two lines
          // This removes any duplicates inside the results & index
          results = results.filter(function (feature) {
            return feature.id !== closestLine.id;
          });
          tree.remove(closestLine);

          // Append the two newly split lines into the results
          featureEach(splitLineWithPoint(closestLine, point), function (line) {
            results.push(line);
            tree.insert(line);
          });
        }
      }
    }
  );
  return featureCollection(results);
}

/**
 * Split LineString with Point
 *
 * @private
 * @param {Feature<LineString>} line LineString
 * @param {Feature<Point>} splitter Point
 * @returns {FeatureCollection<LineString>} split LineStrings
 */
function splitLineWithPoint(
  line: Feature<LineString>,
  splitter: Feature<Point>
) {
  var results = [];

  // handle endpoints
  var startPoint = getCoords(line)[0];
  var endPoint = getCoords(line)[line.geometry.coordinates.length - 1];
  if (
    pointsEquals(startPoint, getCoord(splitter)) ||
    pointsEquals(endPoint, getCoord(splitter))
  )
    return featureCollection([line]);

  // Create spatial index
  var tree = rbush<LineString>();
  var segments = lineSegment(line);
  tree.load(segments);

  // Find all segments that are within bbox of splitter
  var search = tree.search(splitter);

  // Return itself if point is not within spatial index
  if (!search.features.length) return featureCollection([line]);

  // RBush might return multiple lines - only process the closest line to splitter
  var closestSegment = findClosestFeature(splitter, search);

  // Initial value is the first point of the first segments (beginning of line)
  var initialValue = [startPoint];
  var lastCoords = featureReduce(
    segments,
    function (previous, current, index) {
      var currentCoords = getCoords(current)[1];
      var splitterCoords = getCoord(splitter);

      // Location where segment intersects with line
      if (index === closestSegment.id) {
        previous.push(splitterCoords);
        results.push(lineString(previous));
        // Don't duplicate splitter coordinate (Issue #688)
        if (pointsEquals(splitterCoords, currentCoords))
          return [splitterCoords];
        return [splitterCoords, currentCoords];

        // Keep iterating over coords until finished or intersection is found
      } else {
        previous.push(currentCoords);
        return previous;
      }
    },
    initialValue
  );
  // Append last line to final split results
  if (lastCoords.length > 1) {
    results.push(lineString(lastCoords));
  }
  return featureCollection(results);
}

/**
 * Find Closest Feature
 *
 * @private
 * @param {Feature<Point>} point Feature must be closest to this point
 * @param {FeatureCollection<LineString>} lines Collection of Features
 * @returns {Feature<LineString>} closest LineString
 */
function findClosestFeature(
  point: Feature<Point>,
  lines: FeatureCollection<LineString>
): Feature<LineString> {
  if (!lines.features.length) throw new Error("lines must contain features");
  // Filter to one segment that is the closest to the line
  if (lines.features.length === 1) return lines.features[0];

  var closestFeature;
  var closestDistance = Infinity;
  featureEach(lines, function (segment) {
    var pt = nearestPointOnLine(segment, point);
    var dist = pt.properties.pointDistance;
    if (dist < closestDistance) {
      closestFeature = segment;
      closestDistance = dist;
    }
  });
  return closestFeature!;
}

/**
 * Compares two points and returns if they are equals
 *
 * @private
 * @param {Array<number>} pt1 point
 * @param {Array<number>} pt2 point
 * @returns {boolean} true if they are equals
 */
function pointsEquals(pt1: number[], pt2: number[]) {
  return pt1[0] === pt2[0] && pt1[1] === pt2[1];
}

export { Splitter, lineSplit };
export default lineSplit;
