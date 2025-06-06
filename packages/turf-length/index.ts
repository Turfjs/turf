import { Feature, FeatureCollection, GeometryCollection } from "geojson";
import { distance } from "@turf/distance";
import { Units } from "@turf/helpers";
import { segmentReduce } from "@turf/meta";

/**
 * Takes a {@link GeoJSON} and measures its length in the specified units, {@link (Multi)Point}'s distance are ignored.
 *
 * @function
 * @param {Feature<LineString|MultiLineString>} geojson GeoJSON to measure
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units=kilometers] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}.
 * @returns {number} length of GeoJSON
 * @example
 * var line = turf.lineString([[115, -32], [131, -22], [143, -25], [150, -34]]);
 * var length = turf.length(line, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [line];
 * line.properties.distance = length;
 */
function length(
  geojson: Feature<any> | FeatureCollection<any> | GeometryCollection,
  options: {
    units?: Units;
  } = {}
): number {
  // Calculate distance from 2-vertex line segments
  return segmentReduce(
    geojson,
    (previousValue, segment) => {
      const coords = segment!.geometry.coordinates;
      return previousValue! + distance(coords[0], coords[1], options);
    },
    0
  );
}

export { length };
export default length;
