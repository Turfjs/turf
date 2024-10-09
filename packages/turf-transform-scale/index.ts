import { Corners, Coord } from "@turf/helpers";
import { FeatureCollection, GeoJSON, GeometryCollection } from "geojson";
import { clone } from "@turf/clone";
import { center } from "@turf/center";
import { centroid } from "@turf/centroid";
import { bbox as turfBBox } from "@turf/bbox";
import { rhumbBearing } from "@turf/rhumb-bearing";
import { rhumbDistance } from "@turf/rhumb-distance";
import { rhumbDestination } from "@turf/rhumb-destination";
import { coordEach, featureEach } from "@turf/meta";
import { point, isObject } from "@turf/helpers";
import { getCoord, getCoords, getType } from "@turf/invariant";

/**
 * Scale GeoJSON objects from a given point by a scaling factor e.g. factor=2
 * would make each object 200% larger.
 * If a FeatureCollection is provided, the origin point will be calculated
 * based on each individual feature _unless_ an exact
 *
 * @function
 * @param {GeoJSON|GeometryCollection} geojson objects to be scaled
 * @param {number} factor of scaling, positive values greater than 0. Numbers between 0 and 1 will shrink the geojson, numbers greater than 1 will expand it, a factor of 1 will not change the geojson.
 * @param {Object} [options={}] Optional parameters
 * @param {Corners|Coord} [options.origin='centroid'] Point from which the scaling will occur (string options: sw/se/nw/ne/center/centroid)
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance improvement if true)
 * @returns {GeoJSON|GeometryCollection} scaled GeoJSON
 * @example
 * const poly = turf.polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
 * const scaledPoly = turf.transformScale(poly, 3);
 *
 * //addToMap
 * const addToMap = [poly, scaledPoly];
 * scaledPoly.properties = {stroke: '#F00', 'stroke-width': 4};
 */
function transformScale<T extends GeoJSON | GeometryCollection>(
  geojson: T,
  factor: number,
  options?: {
    origin?: Corners | Coord;
    mutate?: boolean;
  }
): T {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  const origin = options.origin || "centroid";
  const mutate = options.mutate || false;

  // Input validation
  if (!geojson) throw new Error("geojson required");
  if (typeof factor !== "number" || factor <= 0)
    throw new Error("invalid factor");
  const originIsPoint = Array.isArray(origin) || typeof origin === "object";

  // Clone geojson to avoid side effects
  if (mutate !== true) geojson = clone(geojson);

  // Scale each Feature separately if a feature collection AND the user didn't
  // pass a single explicit point to scale the whole collection from.
  if (geojson.type === "FeatureCollection" && !originIsPoint) {
    featureEach(geojson, function (feature, index) {
      // The type guard above is not recognised in the callback so we have to
      // cast to accept responsibility.
      (geojson as FeatureCollection).features[index] = scale(
        feature,
        factor,
        origin
      );
    });
    return geojson;
  }
  // Scale Feature/Geometry
  return scale(geojson, factor, origin);
}

/**
 * Scale Feature/Geometry
 *
 * @private
 * @param {GeoJSON|GeometryCollection} feature feature or geometry collection to scale
 * @param {number} factor of scaling, positive or negative values greater than 0
 * @param {Corners|Coord} [origin="centroid"] Point from which the scaling will occur (string options: sw/se/nw/ne/center/centroid)
 * @returns {GeoJSON|GeometryCollection} scaled GeoJSON Feature/Geometry
 */
function scale<T extends GeoJSON | GeometryCollection>(
  feature: T,
  factor: number,
  origin: Corners | Coord
): T {
  // Default params
  const isPoint = getType(feature) === "Point";
  // Work with a Coord equivalent of the origin from here on.
  const originCoord: Coord = defineOrigin(feature, origin);

  // Shortcut no-scaling
  if (factor === 1 || isPoint) return feature;

  // Scale each coordinate
  coordEach(feature, function (coord) {
    const originalDistance = rhumbDistance(originCoord, coord);
    const bearing = rhumbBearing(originCoord, coord);
    const newDistance = originalDistance * factor;
    const newCoord = getCoords(
      rhumbDestination(originCoord, newDistance, bearing)
    );
    coord[0] = newCoord[0];
    coord[1] = newCoord[1];
    if (coord.length === 3) coord[2] *= factor;
  });

  delete feature.bbox;

  return feature;
}

/**
 * Define Origin
 *
 * @private
 * @param {GeoJSON|GeometryCollection} geojson GeoJSON
 * @param {Corners|Coord} origin sw/se/nw/ne/center/centroid
 * @returns {Feature<Point>} Point origin
 */
function defineOrigin(
  geojson: GeoJSON | GeometryCollection,
  origin: Corners | Coord
): Coord {
  // Default params
  if (origin === undefined || origin === null) origin = "centroid";

  // Input Coord
  if (Array.isArray(origin) || typeof origin === "object")
    return getCoord(origin);

  // Define BBox
  const bbox = geojson.bbox
    ? geojson.bbox
    : turfBBox(geojson, { recompute: true });
  const west = bbox[0];
  const south = bbox[1];
  const east = bbox[2];
  const north = bbox[3];

  // Having to disable eslint below for lines which fail the no-fallthrough
  // rule, though only because of the ts-expect-error rules. Once we remove
  // southeast, bottomright, rightbottom, etc we should be able to remove all
  // these supressions.
  /* eslint-disable no-fallthrough */
  switch (origin) {
    case "sw":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "southwest":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "westsouth":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "bottomleft":
      return point([west, south]);
    case "se":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "southeast":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "eastsouth":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "bottomright":
      return point([east, south]);
    case "nw":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "northwest":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "westnorth":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "topleft":
      return point([west, north]);
    case "ne":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "northeast":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "eastnorth":
    // @ts-expect-error undocumented, to be removed for v8 #techdebt
    case "topright":
      return point([east, north]);
    case "center":
      return center(geojson);
    case undefined:
    case null:
    case "centroid":
      return centroid(geojson);
    default:
      throw new Error("invalid origin");
  }
  /* eslint-enable no-fallthrough */
}

export { transformScale };
export default transformScale;
