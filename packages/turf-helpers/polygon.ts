import type {
  BBox,
  Feature,
  Polygon,
  Position,
  GeoJsonProperties,
} from "geojson";
import type { Id } from "./lib/geojson.js";
import { feature } from "./feature.js";

/**
 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Polygon>} Polygon Feature
 * @example
 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
 *
 * //=polygon
 */
export function polygon<P extends GeoJsonProperties = GeoJsonProperties>(
  coordinates: Position[][],
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): Feature<Polygon, P> {
  for (const ring of coordinates) {
    if (ring.length < 4) {
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    }

    if (ring[ring.length - 1].length !== ring[0].length) {
      throw new Error("First and last Position are not equivalent.");
    }

    for (let j = 0; j < ring[ring.length - 1].length; j++) {
      // Check if first point of Polygon contains two numbers
      if (ring[ring.length - 1][j] !== ring[0][j]) {
        throw new Error("First and last Position are not equivalent.");
      }
    }
  }
  const geom: Polygon = {
    type: "Polygon",
    coordinates,
  };
  return feature(geom, properties, options);
}
