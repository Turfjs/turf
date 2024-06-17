import type {
  BBox,
  Feature,
  LineString,
  Position,
  GeoJsonProperties,
} from "geojson";
import type { Id } from "./lib/geojson.js";
import { feature } from "./feature.js";

/**
 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<LineString>} LineString Feature
 * @example
 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
 *
 * //=linestring1
 * //=linestring2
 */
export function lineString<P extends GeoJsonProperties = GeoJsonProperties>(
  coordinates: Position[],
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): Feature<LineString, P> {
  if (coordinates.length < 2) {
    throw new Error("coordinates must be an array of two or more positions");
  }
  const geom: LineString = {
    type: "LineString",
    coordinates,
  };
  return feature(geom, properties, options);
}
