import { length } from "@turf/length";
import { lineSliceAlong } from "@turf/line-slice-along";
import { flattenEach } from "@turf/meta";
import { featureCollection, isObject, Units } from "@turf/helpers";
import {
  Feature,
  FeatureCollection,
  GeometryCollection,
  LineString,
  MultiLineString,
} from "geojson";

/**
 * Divides a {@link LineString} into chunks of a specified length.
 * If the line is shorter than the segment length then the original line is returned.
 *
 * @function
 * @param {FeatureCollection|Geometry|Feature<LineString|MultiLineString>} geojson the LineString or MultiLineStrings to split
 * @param {number} segmentLength how long to make each segment
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}
 * @param {boolean} [options.reverse=false] reverses coordinates to start the first chunked segment at the end
 * @returns {FeatureCollection<LineString>} collection of line segments
 * @example
 * var line = turf.lineString([[-95, 40], [-93, 45], [-85, 50]]);
 *
 * var chunk = turf.lineChunk(line, 15, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [chunk];
 */
function lineChunk<T extends LineString | MultiLineString>(
  geojson:
    | Feature<T>
    | FeatureCollection<T>
    | T
    | GeometryCollection<T>
    | Feature<GeometryCollection<T>>,
  segmentLength: number,
  options: {
    units?: Units;
    reverse?: boolean;
  } = {}
): FeatureCollection<LineString> {
  // Optional parameters
  if (!isObject(options)) throw new Error("options is invalid");
  const { units = "kilometers", reverse = false } = options;

  // Validation
  if (!geojson) throw new Error("geojson is required");
  if (segmentLength <= 0) {
    throw new Error("segmentLength must be greater than 0");
  }

  // Container
  const results: Feature<LineString>[] = [];

  // Flatten each feature to simple LineString
  flattenEach(geojson, (feature: Feature<T>) => {
    if (feature.geometry.type !== "LineString") {
      throw new Error(
        "Only LineString and MultiLineString geometry types are supported"
      );
    }

    // reverses coordinates to start the first chunked segment at the end
    if (reverse) {
      feature.geometry.coordinates = feature.geometry.coordinates.reverse();
    }

    sliceLineSegments(
      feature as Feature<LineString>,
      segmentLength,
      units,
      (segment) => {
        results.push(segment);
      }
    );
  });
  return featureCollection(results);
}

/**
 * Slice Line Segments
 *
 * @private
 * @param {Feature<LineString>} line GeoJSON LineString
 * @param {number} segmentLength how long to make each segment
 * @param {Units}[units='kilometers'] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}
 * @param {Function} callback iterate over sliced line segments
 * @returns {void}
 */
function sliceLineSegments(
  line: Feature<LineString>,
  segmentLength: number,
  units: Units,
  callback: (feature: Feature<LineString>) => void
): void {
  var lineLength = length(line, { units: units });

  // If the line is shorter than the segment length then the orginal line is returned.
  if (lineLength <= segmentLength) {
    return callback(line);
  }

  var numberOfSegments = lineLength / segmentLength;

  // If numberOfSegments is integer, no need to plus 1
  if (!Number.isInteger(numberOfSegments)) {
    numberOfSegments = Math.floor(numberOfSegments) + 1;
  }

  for (var i = 0; i < numberOfSegments; i++) {
    var outline = lineSliceAlong(
      line,
      segmentLength * i,
      segmentLength * (i + 1),
      { units: units }
    );
    callback(outline);
  }
}

export { lineChunk };
export default lineChunk;
