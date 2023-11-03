import {
  Feature,
  FeatureCollection,
  Geometry,
  LineString,
  MultiPoint,
  MultiLineString,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";
import { isNumber } from "@turf/helpers";

/**
 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
 *
 * @name getCoord
 * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
 * @returns {Array<number>} coordinates
 * @example
 * var pt = turf.point([10, 10]);
 *
 * var coord = turf.getCoord(pt);
 * //= [10, 10]
 */
export function getCoord(coord: Feature<Point> | Point | number[]): number[] {
  if (!coord) {
    throw new Error("coord is required");
  }

  if (!Array.isArray(coord)) {
    if (
      coord.type === "Feature" &&
      coord.geometry !== null &&
      coord.geometry.type === "Point"
    ) {
      return [...coord.geometry.coordinates];
    }
    if (coord.type === "Point") {
      return [...coord.coordinates];
    }
  }
  if (
    Array.isArray(coord) &&
    coord.length >= 2 &&
    !Array.isArray(coord[0]) &&
    !Array.isArray(coord[1])
  ) {
    return [...coord];
  }

  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}

/**
 * Unwrap coordinates from a Feature, Geometry Object or an Array
 *
 * @name getCoords
 * @param {Array<any>|Geometry|Feature} coords Feature, Geometry Object or an Array
 * @returns {Array<any>} coordinates
 * @example
 * var poly = turf.polygon([[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]);
 *
 * var coords = turf.getCoords(poly);
 * //= [[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]
 */
export function getCoords<
  G extends
    | Point
    | LineString
    | Polygon
    | MultiPoint
    | MultiLineString
    | MultiPolygon,
>(coords: any[] | Feature<G> | G): any[] {
  if (Array.isArray(coords)) {
    return coords;
  }

  // Feature
  if (coords.type === "Feature") {
    if (coords.geometry !== null) {
      return coords.geometry.coordinates;
    }
  } else {
    // Geometry
    if (coords.coordinates) {
      return coords.coordinates;
    }
  }

  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}

/**
 * Checks if coordinates contains a number
 *
 * @name containsNumber
 * @param {Array<any>} coordinates GeoJSON Coordinates
 * @returns {boolean} true if Array contains a number
 */
export function containsNumber(coordinates: any[]): boolean {
  if (
    coordinates.length > 1 &&
    isNumber(coordinates[0]) &&
    isNumber(coordinates[1])
  ) {
    return true;
  }

  if (Array.isArray(coordinates[0]) && coordinates[0].length) {
    return containsNumber(coordinates[0]);
  }
  throw new Error("coordinates must only contain numbers");
}

/**
 * Enforce expectations about types of GeoJSON objects for Turf.
 *
 * @name geojsonType
 * @param {GeoJSON} value any GeoJSON object
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
export function geojsonType(value: any, type: string, name: string): void {
  if (!type || !name) {
    throw new Error("type and name required");
  }

  if (!value || value.type !== type) {
    throw new Error(
      "Invalid input to " +
        name +
        ": must be a " +
        type +
        ", given " +
        value.type
    );
  }
}

/**
 * Enforce expectations about types of {@link Feature} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name featureOf
 * @param {Feature} feature a feature with an expected geometry type
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} error if value is not the expected type.
 */
export function featureOf(
  feature: Feature<any>,
  type: string,
  name: string
): void {
  if (!feature) {
    throw new Error("No feature passed");
  }
  if (!name) {
    throw new Error(".featureOf() requires a name");
  }
  if (!feature || feature.type !== "Feature" || !feature.geometry) {
    throw new Error(
      "Invalid input to " + name + ", Feature with geometry required"
    );
  }
  if (!feature.geometry || feature.geometry.type !== type) {
    throw new Error(
      "Invalid input to " +
        name +
        ": must be a " +
        type +
        ", given " +
        feature.geometry.type
    );
  }
}

/**
 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name collectionOf
 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
export function collectionOf(
  featureCollection: FeatureCollection<any>,
  type: string,
  name: string
) {
  if (!featureCollection) {
    throw new Error("No featureCollection passed");
  }
  if (!name) {
    throw new Error(".collectionOf() requires a name");
  }
  if (!featureCollection || featureCollection.type !== "FeatureCollection") {
    throw new Error(
      "Invalid input to " + name + ", FeatureCollection required"
    );
  }
  for (const feature of featureCollection.features) {
    if (!feature || feature.type !== "Feature" || !feature.geometry) {
      throw new Error(
        "Invalid input to " + name + ", Feature with geometry required"
      );
    }
    if (!feature.geometry || feature.geometry.type !== type) {
      throw new Error(
        "Invalid input to " +
          name +
          ": must be a " +
          type +
          ", given " +
          feature.geometry.type
      );
    }
  }
}

/**
 * Get Geometry from Feature or Geometry Object
 *
 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
 * @returns {Geometry|null} GeoJSON Geometry Object
 * @throws {Error} if geojson is not a Feature or Geometry Object
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getGeom(point)
 * //={"type": "Point", "coordinates": [110, 40]}
 */
export function getGeom<G extends Geometry>(geojson: Feature<G> | G): G {
  if (geojson.type === "Feature") {
    return geojson.geometry;
  }
  return geojson;
}

/**
 * Get GeoJSON object's type, Geometry type is prioritize.
 *
 * @param {GeoJSON} geojson GeoJSON object
 * @param {string} [name="geojson"] name of the variable to display in error message (unused)
 * @returns {string} GeoJSON type
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getType(point)
 * //="Point"
 */
export function getType(
  geojson: Feature<any> | FeatureCollection<any> | Geometry,
  _name?: string
): string {
  if (geojson.type === "FeatureCollection") {
    return "FeatureCollection";
  }
  if (geojson.type === "GeometryCollection") {
    return "GeometryCollection";
  }
  if (geojson.type === "Feature" && geojson.geometry !== null) {
    return geojson.geometry.type;
  }
  return geojson.type;
}
