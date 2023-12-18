import type {
  Feature,
  Position,
  GeometryCollection,
  Geometry,
  LineString,
  MultiLineString,
  MultiPolygon,
  Polygon,
  FeatureCollection,
} from "geojson";
import { clone } from "@turf/clone";
import { booleanClockwise } from "@turf/boolean-clockwise";
import { geomEach, featureEach } from "@turf/meta";
import { getCoords } from "@turf/invariant";
import { featureCollection, isObject } from "@turf/helpers";
import type { AllGeoJSON } from "@turf/helpers";

/**
 * Rewind {@link LineString|(Multi)LineString} or {@link Polygon|(Multi)Polygon} outer ring counterclockwise and inner rings clockwise (Uses {@link http://en.wikipedia.org/wiki/Shoelace_formula|Shoelace Formula}).
 *
 * @name rewind
 * @param {GeoJSON} geojson input GeoJSON Polygon
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.reverse=false] enable reverse winding
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} rewind Polygon
 * @example
 * var polygon = turf.polygon([[[121, -29], [138, -29], [138, -18], [121, -18], [121, -29]]]);
 *
 * var rewind = turf.rewind(polygon);
 *
 * //addToMap
 * var addToMap = [rewind];
 */
function rewind<T extends AllGeoJSON>(
  geojson: T,
  options: {
    reverse?: boolean;
    mutate?: boolean;
  } = {}
): Geometry | Feature | FeatureCollection {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  const mutate = options.mutate ?? false;
  const reverse = options.reverse ?? false;

  // validation
  if (!geojson) throw new Error("<geojson> is required");
  if (typeof reverse !== "boolean")
    throw new Error("<reverse> must be a boolean");
  if (typeof mutate !== "boolean")
    throw new Error("<mutate> must be a boolean");

  // Prevent input mutation if requested and necessary.
  if (!mutate && geojson.type !== "Point" && geojson.type !== "MultiPoint") {
    geojson = clone(geojson);
  }

  // Support Feature Collection or Geometry Collection
  const results: Feature[] = [];
  switch (geojson.type) {
    case "GeometryCollection":
      geomEach(geojson, function (geometry) {
        rewindFeature(geometry, reverse);
      });
      return geojson;
    case "FeatureCollection":
      featureEach(geojson, function (feature) {
        const rewoundFeature = rewindFeature(feature, reverse) as Feature;
        featureEach(rewoundFeature, function (result) {
          results.push(result);
        });
      });
      return featureCollection(results);
  }
  // Support Feature or Geometry Objects
  return rewindFeature(geojson, reverse);
}

/**
 * Rewind
 *
 * @private
 * @param {Geometry|Feature<any>} geojson Geometry or Feature
 * @param {Boolean} [reverse=false] enable reverse winding
 * @returns {Geometry|Feature<any>} rewind Geometry or Feature
 */
function rewindFeature(
  geojson: Geometry | GeometryCollection | Feature,
  reverse: boolean
) {
  const type =
    geojson.type === "Feature" ? geojson.geometry.type : geojson.type;

  // Support all GeoJSON Geometry Objects
  switch (type) {
    case "GeometryCollection":
      geomEach(geojson, function (geometry) {
        rewindFeature(geometry, reverse);
      });
      return geojson;
    case "LineString":
      rewindLineString(getCoords(geojson as LineString), reverse);
      return geojson;
    case "Polygon":
      rewindPolygon(getCoords(geojson as Polygon), reverse);
      return geojson;
    case "MultiLineString":
      getCoords(geojson as MultiLineString).forEach(function (lineCoords) {
        rewindLineString(lineCoords, reverse);
      });
      return geojson;
    case "MultiPolygon":
      getCoords(geojson as MultiPolygon).forEach(function (lineCoords) {
        rewindPolygon(lineCoords, reverse);
      });
      return geojson;
    case "Point":
    case "MultiPoint":
      // noop
      return geojson;
  }
}

/**
 * Rewind LineString - outer ring clockwise
 *
 * @private
 * @param {Array<Array<number>>} coords GeoJSON LineString geometry coordinates
 * @param {Boolean} [reverse=false] enable reverse winding
 * @returns {void} mutates coordinates
 */
function rewindLineString(coords: Position[], reverse: boolean) {
  if (booleanClockwise(coords) === reverse) coords.reverse();
}

/**
 * Rewind Polygon - outer ring counterclockwise and inner rings clockwise.
 *
 * @private
 * @param {Array<Array<Array<number>>>} coords GeoJSON Polygon geometry coordinates
 * @param {Boolean} [reverse=false] enable reverse winding
 * @returns {void} mutates coordinates
 */
function rewindPolygon(coords: Position[][], reverse: boolean) {
  // outer ring
  if (booleanClockwise(coords[0]) !== reverse) {
    coords[0].reverse();
  }
  // inner rings
  for (let i = 1; i < coords.length; i++) {
    if (booleanClockwise(coords[i]) === reverse) {
      coords[i].reverse();
    }
  }
}

export { rewind };
export default rewind;
