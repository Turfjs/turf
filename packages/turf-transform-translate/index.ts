import { GeoJSON, GeometryCollection } from "geojson";
import { coordEach } from "@turf/meta";
import { isObject, Units } from "@turf/helpers";
import { getCoords } from "@turf/invariant";
import { clone } from "@turf/clone";
import { rhumbDestination } from "@turf/rhumb-destination";

/**
 * Moves any geojson Feature or Geometry of a specified distance along a Rhumb Line
 * on the provided direction angle.
 *
 * Note that this moves the points of your shape individually and can therefore change
 * the overall shape. How noticable this is depends on the distance and the used projection.
 *
 * @function
 * @param {GeoJSON|GeometryCollection} geojson object to be translated
 * @param {number} distance length of the motion; negative values determine motion in opposite direction
 * @param {number} direction of the motion; angle from North in decimal degrees, positive clockwise
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] in which `distance` will be expressed; Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}
 * @param {number} [options.zTranslation=0] length of the vertical motion, same unit of distance
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON|GeometryCollection} the translated GeoJSON object
 * @example
 * var poly = turf.polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
 * var translatedPoly = turf.transformTranslate(poly, 100, 35);
 *
 * //addToMap
 * var addToMap = [poly, translatedPoly];
 * translatedPoly.properties = {stroke: '#F00', 'stroke-width': 4};
 */
function transformTranslate<T extends GeoJSON | GeometryCollection>(
  geojson: T,
  distance: number,
  direction: number,
  options?: {
    units?: Units;
    zTranslation?: number;
    mutate?: boolean;
  }
): T {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var units = options.units;
  var zTranslation = options.zTranslation;
  var mutate = options.mutate;

  // Input validation
  if (!geojson) throw new Error("geojson is required");
  if (distance === undefined || distance === null || isNaN(distance))
    throw new Error("distance is required");
  if (zTranslation && typeof zTranslation !== "number" && isNaN(zTranslation))
    throw new Error("zTranslation is not a number");

  // Shortcut no-motion
  zTranslation = zTranslation !== undefined ? zTranslation : 0;
  if (distance === 0 && zTranslation === 0) return geojson;

  if (direction === undefined || direction === null || isNaN(direction))
    throw new Error("direction is required");

  // Invert with negative distances
  if (distance < 0) {
    distance = -distance;
    direction = direction + 180;
  }

  // Clone geojson to avoid side effects
  if (mutate === false || mutate === undefined) geojson = clone(geojson);

  // Translate each coordinate
  coordEach(geojson, function (pointCoords) {
    var newCoords = getCoords(
      rhumbDestination(pointCoords, distance, direction, { units: units })
    );
    pointCoords[0] = newCoords[0];
    pointCoords[1] = newCoords[1];
    if (zTranslation && pointCoords.length === 3)
      pointCoords[2] += zTranslation;
  });
  return geojson;
}

export { transformTranslate };
export default transformTranslate;
