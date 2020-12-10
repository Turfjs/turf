import clone from "@turf/clone";
import center from "@turf/center";
import centroid from "@turf/centroid";
import turfBBox from "@turf/bbox";
import rhumbBearing from "@turf/rhumb-bearing";
import rhumbDistance from "@turf/rhumb-distance";
import rhumbDestination from "@turf/rhumb-destination";
import { coordEach, featureEach } from "@turf/meta";
import { point, isObject } from "@turf/helpers";
import { getCoord, getCoords, getType } from "@turf/invariant";

/**
 * Scale a GeoJSON from a given point by a factor of scaling (ex: factor=2 would make the GeoJSON 200% larger).
 * If a FeatureCollection is provided, the origin point will be calculated based on each individual Feature.
 *
 * @name transformScale
 * @param {GeoJSON} geojson GeoJSON to be scaled
 * @param {number} factor of scaling, positive or negative values greater than 0
 * @param {Object} [options={}] Optional parameters
 * @param {string|Coord} [options.origin='centroid'] Point from which the scaling will occur (string options: sw/se/nw/ne/center/centroid)
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} scaled GeoJSON
 * @example
 * var poly = turf.polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
 * var scaledPoly = turf.transformScale(poly, 3);
 *
 * //addToMap
 * var addToMap = [poly, scaledPoly];
 * scaledPoly.properties = {stroke: '#F00', 'stroke-width': 4};
 */
function transformScale(geojson, factor, options) {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var origin = options.origin;
  var mutate = options.mutate;

  // Input validation
  if (!geojson) throw new Error("geojson required");
  if (typeof factor !== "number" || factor === 0)
    throw new Error("invalid factor");
  var originIsPoint = Array.isArray(origin) || typeof origin === "object";

  // Clone geojson to avoid side effects
  if (mutate !== true) geojson = clone(geojson);

  // Scale each Feature separately
  if (geojson.type === "FeatureCollection" && !originIsPoint) {
    featureEach(geojson, function (feature, index) {
      geojson.features[index] = scale(feature, factor, origin);
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
 * @param {Feature|Geometry} feature GeoJSON Feature/Geometry
 * @param {number} factor of scaling, positive or negative values greater than 0
 * @param {string|Coord} [origin="centroid"] Point from which the scaling will occur (string options: sw/se/nw/ne/center/centroid)
 * @returns {Feature|Geometry} scaled GeoJSON Feature/Geometry
 */
function scale(feature, factor, origin) {
  // Default params
  var isPoint = getType(feature) === "Point";
  origin = defineOrigin(feature, origin);

  // Shortcut no-scaling
  if (factor === 1 || isPoint) return feature;

  // Scale each coordinate
  coordEach(feature, function (coord) {
    var originalDistance = rhumbDistance(origin, coord);
    var bearing = rhumbBearing(origin, coord);
    var newDistance = originalDistance * factor;
    var newCoord = getCoords(rhumbDestination(origin, newDistance, bearing));
    coord[0] = newCoord[0];
    coord[1] = newCoord[1];
    if (coord.length === 3) coord[2] *= factor;
  });

  return feature;
}

/**
 * Define Origin
 *
 * @private
 * @param {GeoJSON} geojson GeoJSON
 * @param {string|Coord} origin sw/se/nw/ne/center/centroid
 * @returns {Feature<Point>} Point origin
 */
function defineOrigin(geojson, origin) {
  // Default params
  if (origin === undefined || origin === null) origin = "centroid";

  // Input Coord
  if (Array.isArray(origin) || typeof origin === "object")
    return getCoord(origin);

  // Define BBox
  var bbox = geojson.bbox ? geojson.bbox : turfBBox(geojson);
  var west = bbox[0];
  var south = bbox[1];
  var east = bbox[2];
  var north = bbox[3];

  switch (origin) {
    case "sw":
    case "southwest":
    case "westsouth":
    case "bottomleft":
      return point([west, south]);
    case "se":
    case "southeast":
    case "eastsouth":
    case "bottomright":
      return point([east, south]);
    case "nw":
    case "northwest":
    case "westnorth":
    case "topleft":
      return point([west, north]);
    case "ne":
    case "northeast":
    case "eastnorth":
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
}

export default transformScale;
