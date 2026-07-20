import type { Position, GeoJSON } from "geojson";
import { coordEach } from "@turf/meta";
import { type AllGeoJSON, isNumber } from "@turf/helpers";
import { clone } from "@turf/clone";

/**
 * Converts a WGS84 GeoJSON object into Mercator (EPSG:900913) projection
 *
 * @function
 * @param {GeoJSON|Position} geojson WGS84 GeoJSON object
 * @param {Object} [options] Optional parameters
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} Projected GeoJSON
 * @example
 * var pt = turf.point([-71,41]);
 * var converted = turf.toMercator(pt);
 *
 * //addToMap
 * var addToMap = [pt, converted];
 */
function toMercator<G = AllGeoJSON | Position>(
  geojson: G,
  options: { mutate?: boolean } = {}
): G {
  return project(
    geojson as GeoJSON | Position,
    convertToMercator,
    options
  ) as G;
}

/**
 * Converts a Mercator (EPSG:900913) GeoJSON object into WGS84 projection
 *
 * @function
 * @param {GeoJSON|Position} geojson Mercator GeoJSON object
 * @param {Object} [options] Optional parameters
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} Projected GeoJSON
 * @example
 * var pt = turf.point([-7903683.846322424, 5012341.663847514]);
 * var converted = turf.toWgs84(pt);
 *
 * //addToMap
 * var addToMap = [pt, converted];
 */
function toWgs84<G = AllGeoJSON | Position>(
  geojson: G,
  options: { mutate?: boolean } = {}
): G {
  return project(
    geojson as AllGeoJSON | Position,
    convertToWgs84,
    options
  ) as G;
}

/**
 * Projects GeoJSON or Position objects using an arbitrary projection function
 *
 * @param {GeoJSON} geojson GeoJSON or Position object
 * @param {string} projection A function that implements the projection
 * @param {Object} [options] Optional parameters
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} Converted GeoJSON in the same shape as the original
 */
function project<G extends GeoJSON | Position>(
  geojson: G,
  projection: (input: number[]) => number[],
  options: { mutate?: boolean } = {}
): G {
  const mutate = options?.mutate ?? false;

  // Validation
  if (!geojson) {
    throw new Error("geojson is required");
  }

  if (Array.isArray(geojson) && isNumber(geojson[0])) {
    // Handle Position
    geojson = projection(geojson) as G;
  } else {
    // Handle GeoJSON
    // Handle possible data mutation
    if (mutate !== true) {
      geojson = clone(geojson as GeoJSON) as G;
    }

    coordEach(geojson as GeoJSON, function (coord) {
      var newCoord = projection(coord);
      coord[0] = newCoord[0];
      coord[1] = newCoord[1];
    });
  }
  return geojson;
}

/**
 * Convert lon/lat values to 900913 x/y.
 * (from https://github.com/mapbox/sphericalmercator)
 *
 * @private
 * @param {Array<number>} lonLat WGS84 point
 * @returns {Array<number>} Mercator [x, y] point
 */
function convertToMercator(lonLat: number[]) {
  var D2R = Math.PI / 180,
    // 900913 properties
    A = 6378137.0,
    MAXEXTENT = 20037508.342789244;

  // compensate longitudes passing the 180th meridian
  // from https://github.com/proj4js/proj4js/blob/master/lib/common/adjust_lon.js
  var adjusted =
    Math.abs(lonLat[0]) <= 180 ? lonLat[0] : lonLat[0] - sign(lonLat[0]) * 360;
  var xy = [
    A * adjusted * D2R,
    A * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * lonLat[1] * D2R)),
  ];

  // if xy value is beyond maxextent (e.g. poles), return maxextent
  if (xy[0] > MAXEXTENT) xy[0] = MAXEXTENT;
  if (xy[0] < -MAXEXTENT) xy[0] = -MAXEXTENT;
  if (xy[1] > MAXEXTENT) xy[1] = MAXEXTENT;
  if (xy[1] < -MAXEXTENT) xy[1] = -MAXEXTENT;

  return xy;
}

/**
 * Convert 900913 x/y values to lon/lat.
 * (from https://github.com/mapbox/sphericalmercator)
 *
 * @private
 * @param {Array<number>} xy Mercator [x, y] point
 * @returns {Array<number>} WGS84 [lon, lat] point
 */
function convertToWgs84(xy: number[]) {
  // 900913 properties.
  var R2D = 180 / Math.PI;
  var A = 6378137.0;

  return [
    (xy[0] * R2D) / A,
    (Math.PI * 0.5 - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D,
  ];
}

/**
 * Returns the sign of the input, or zero
 *
 * @private
 * @param {number} x input
 * @returns {number} -1|0|1 output
 */
function sign(x: number) {
  return x < 0 ? -1 : x > 0 ? 1 : 0;
}

export { toMercator, toWgs84, project };
