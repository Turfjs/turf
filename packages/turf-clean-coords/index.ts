import {
  GeoJSON,
  Feature,
  Geometry,
  FeatureCollection,
  Position,
  GeoJsonProperties,
  GeometryCollection,
  MultiPoint,
} from "geojson";
import { feature, featureCollection } from "@turf/helpers";
import { booleanPointOnLine } from "@turf/boolean-point-on-line";
import { lineString } from "@turf/helpers";

/** Generic response type for cleanCoords */
type CleanCoordsResult<T extends GeoJSON> =
  T extends Feature<infer G extends Geometry, infer P extends GeoJsonProperties>
    ? Feature<G, P>
    : T extends Geometry
      ? T
      : GeoJSON;

function cleanCoords<G extends Geometry, P extends GeoJsonProperties>(
  geojson: FeatureCollection<G, P>,
  options?: { mutate?: boolean; epsilon?: number }
): FeatureCollection<G, P>;
function cleanCoords<G extends Geometry, P extends GeoJsonProperties>(
  geojson: Feature<G, P>,
  options?: { mutate?: boolean; epsilon?: number }
): Feature<G, P>;
function cleanCoords<G extends Geometry>(
  geojson: GeometryCollection<G>,
  options?: { mutate?: boolean; epsilon?: number }
): GeometryCollection<G>;
function cleanCoords<G extends Geometry>(
  geojson: G,
  options?: { mutate?: boolean; epsilon?: number }
): G;
function cleanCoords<T extends GeoJSON>(
  geojson: T,
  options?: { mutate?: boolean; epsilon?: number }
): CleanCoordsResult<T>;
function cleanCoords(
  geojson: GeoJSON,
  options?: { mutate?: boolean; epsilon?: number }
): GeoJSON;
/** @deprecated loosely typed version deprecated. Will be removed in next major version */
function cleanCoords(
  geojson: any,
  options?: { mutate?: boolean; epsilon?: number }
): any;
/**
 * Removes redundant coordinates from any GeoJSON Type.
 *
 * Always returns the same geojson type that it receives.
 *
 * When operating on MultiPoint geometries will remove co-incident points.
 *
 * Obeys consistent structural sharing rules based on the `mutate` option:
 * - Feature and Geometry (nested and top-level) objects will *always* be new
 *   when mutate is false (default) and *always* return the provided object
 *   when mutate is true (i.e., ===).
 * - bbox, id, and properties members on Features, and bbox on Geometries and
 *   FeatureCollections will *always* be === to the original. Note that this
 *   does not copy across other forrign members when mutate is false.
 * - Members other than the geometry(ies) or features members will always be
 *   === to the original.
 * - Geometry(ies) and features members and their nested arrays will be reused
 *   from the passed object or generated new based on performance and
 *   simplicity in the implementation - and therefore will not be deep clones.
 *
 * @function
 * @param {GeoJSON} geojson Any valid GeoJSON type
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated
 * @param {number} [options.epsilon] Fractional number to compare with the cross product result. Useful for dealing with floating points such as lng/lat points
 * @returns {Geometry|Feature} the cleaned input Feature/Geometry
 * @example
 * var line = turf.lineString([[0, 0], [0, 2], [0, 5], [0, 8], [0, 8], [0, 10]]);
 * var multiPoint = turf.multiPoint([[0, 0], [0, 0], [2, 2]]);
 *
 * turf.cleanCoords(line).geometry.coordinates;
 * //= [[0, 0], [0, 10]]
 *
 * turf.cleanCoords(multiPoint).geometry.coordinates;
 * //= [[0, 0], [2, 2]]
 */
function cleanCoords(
  geojson: GeoJSON,
  options: {
    mutate?: boolean;
    epsilon?: number;
  } = {}
): GeoJSON {
  // Backwards compatible with v4.0
  const mutate =
    (typeof options === "object" ? options.mutate : options) ?? false;
  if (!geojson) throw new Error("geojson is required");

  // Store new "clean" points in this Array
  let coordinates: any;
  switch (geojson.type) {
    case "FeatureCollection":
      coordinates = mutate ? geojson.features : [];
      for (let i = 0; i < geojson.features.length; i++) {
        coordinates[i] = cleanCoords(geojson.features[i], options);
      }
      if (mutate) {
        geojson.features = coordinates;
        return geojson;
      }
      return featureCollection(coordinates, { bbox: geojson.bbox });

    case "GeometryCollection":
      coordinates = mutate ? geojson.geometries : [];
      for (let i = 0; i < geojson.geometries.length; i++) {
        coordinates[i] = cleanCoords(geojson.geometries[i], options);
      }
      if (mutate) {
        geojson.geometries = coordinates;
        return geojson;
      }
      return {
        type: "GeometryCollection",
        geometries: coordinates,
      };

    case "Feature":
      coordinates = cleanCoords(geojson.geometry, options);
      if (mutate) {
        geojson.geometry = coordinates;
        return geojson;
      }
      return feature(coordinates, geojson.properties, {
        bbox: geojson.bbox,
        id: geojson.id,
      });

    case "Point":
      coordinates = geojson.coordinates;
      break;

    case "MultiPoint":
      // MultiPoint need to check exact equality for all points
      coordinates = multipointDeduplicate(geojson);
      break;

    case "LineString":
      coordinates = cleanLine(geojson.coordinates, options.epsilon);
      break;

    case "MultiLineString":
      coordinates = mutate ? geojson.coordinates : [];
      for (let i = 0; i < geojson.coordinates.length; i++) {
        coordinates[i] = cleanLine(geojson.coordinates[i], options.epsilon);
      }
      break;

    case "Polygon":
      coordinates = cleanRings(geojson.coordinates, mutate, options.epsilon);
      break;

    case "MultiPolygon":
      coordinates = mutate ? geojson.coordinates : [];
      for (let i = 0; i < geojson.coordinates.length; i++) {
        coordinates[i] = cleanRings(
          geojson.coordinates[i],
          mutate,
          options.epsilon
        );
      }
      break;

    default:
      // Defensive: throw if there is no type
      throw new Error(
        `type "${(geojson as any).type}" is not a valid GeoJSON type`
      );
  }

  // All others have returned, so here we just need to process geometries
  if (mutate) {
    geojson.coordinates = coordinates;
    return geojson;
  }
  const geometry: Geometry = { type: geojson.type, coordinates };
  // Add bbox iff it exists on the incoming
  if (geojson.bbox) geometry.bbox = geojson?.bbox;
  return { type: geojson.type, coordinates };
}

/**
 * Clean Line
 *
 * @private
 * @param {Array<number>|LineString} line Line
 * @param {number} epsilon Cross-product tolerance
 * @returns {Position<number>} Cleaned coordinates
 */
function cleanLine(line: Position[], epsilon?: number): Position[] {
  // handle "clean" segment
  if (line.length === 2) return line;

  // Do not require a new array until we know we need it
  let result: null | Position[] = null;

  // Segments based approach. With initial segment a-b, keep comparing to a
  // longer segment a-c and as long as b is still on a-c, b is a redundant
  // point.
  let a = 0,
    b = 1,
    c = 2;

  // While there is still room to extend the segment ...
  while (c < line.length) {
    if (
      booleanPointOnLine(line[b], lineString([line[a], line[c]]), { epsilon })
    ) {
      // When we land here and are yet to have a result array, we know we need
      // one, so create with the slice up to a (as b is being discarded)
      if (!result) result = line.slice(0, a + 1);

      // b is on a-c, so we can discard point b, and extend a-b to be the same
      // as a-c as the basis for comparison during the next iteration.
      b = c;
    } else {
      // b is NOT on a-c, suggesting a-c is not an extension of a-b. Commit a-b
      // as a necessary segment.
      result?.push(line[b]);

      // Make our a-b for the next iteration start from the end of the segment
      // that was just locked in i.e. next a-b should be the current b-(b+1).
      a = b;
      b++;
    }
    // Plan to look at the next point during the next iteration.
    c++;
  }

  // No remaining points, so commit the endpoint
  result?.push(line[b]);

  // If here and result is still null, then structurally share the segment
  return result ?? line;
}

/**
 * Clean Rings
 *
 * @private
 * @param {Array<number>|LineString} rings Input rings
 * @param {boolean} mutate Mutate passed rings
 * @param {number} epsilon Cross-product tolerance
 * @returns {Position<number>} Cleaned coordinates
 */
function cleanRings(
  rings: Position[][],
  mutate: boolean,
  epsilon?: number
): Position[][] {
  // Re-use the polygon's rings array when mutating to maximize sharing
  // It would be possible to follow a similar approach to cleanLine and only
  // create a new raings array when we know something has changed even for
  // mutate === false, but the extra complexity is not worth it
  const outRings = mutate ? rings : [];
  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i];
    let cleaned = cleanLine(ring, epsilon);

    // For polygons need to make sure the start / end point wasn't one of the
    // points that needed to be cleaned.
    // https://github.com/Turfjs/turf/issues/2406
    // For points [a, b, c, ..., z, a]
    // if a is on line b-z, it too can be removed. New array becomes
    // [b, c, ..., z, b]
    if (
      booleanPointOnLine(
        cleaned[0],
        lineString([cleaned[1], cleaned[cleaned.length - 2]]),
        { epsilon }
      )
    ) {
      // We are about to mutate the cleaned ring, but if no other changes were
      // made to the ring, it will still be === to the original ring[i].
      // Therefore, if not mutating, we clone the ring iff required.
      if (!mutate && cleaned === ring) cleaned = [...cleaned];

      cleaned.shift(); // Discard starting point.
      cleaned.pop(); // Discard closing point.
      cleaned.push(cleaned[0]); // Duplicate the new closing point to end of array.
    }

    // (Multi)Polygons must have at least 4 points and be closed.
    if (cleaned.length < 4) {
      throw new Error("invalid polygon, fewer than 4 points");
    }
    if (!equals(cleaned[0], cleaned[cleaned.length - 1])) {
      throw new Error("invalid polygon, first and last points not equal");
    }

    outRings[i] = cleaned;
  }

  return outRings;
}

/**
 * Compares two points and returns if they are equals
 *
 * @private
 * @param {Position} pt1 point
 * @param {Position} pt2 point
 * @returns {boolean} true if they are equals
 */
function equals(pt1: Position, pt2: Position): boolean {
  return pt1[0] === pt2[0] && pt1[1] === pt2[1];
}

/**
 * Eliminate co-incident points in a MultiPoint geometry.
 *
 * @private
 * @param {MultiPoint} geom Input geometry
 * @returns {Position[]} Deduplicated coordinates
 */
function multipointDeduplicate(geom: MultiPoint): Position[] {
  const seen = new Map();
  for (const point of geom.coordinates) {
    seen.set(point.join("-"), point);
  }
  if (seen.size === geom.coordinates.length) {
    return geom.coordinates;
  } else {
    return [...seen.values()];
  }
}

export { cleanCoords, CleanCoordsResult };
export default cleanCoords;
