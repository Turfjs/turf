import { Position } from "geojson";
import { coordEach } from "@turf/meta";
import { AllGeoJSON, isNumber } from "@turf/helpers";
import { clone } from "@turf/clone";
import proj4 from "proj4";

/**
 * Converts from any Proj4 projection to any Proj4 projection.
 *  * @function
 * @param {GeoJSON|Position} geojson GeoJSON object with coordinates in inProjection
 * @param {string} inProjection defines the proj4 projection of the input coordinates, e.g. "WGS84"
 * @param {string} outProjection defines the proj4 projection of the output coordinates, e.g. "EPSG:900913"
 * @param {Object} [options] Optional parameters
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} Projected GeoJSON
 * @example
 * var pt = turf.point([-71,41]);
 * var converted = turf.toProj4(pt, "EPSG:3857");
 *
 * //addToMap
 * var addToMap = [pt, converted];
 */
function proj4ToProj4<G = AllGeoJSON | Position>(
  geojson: G,
  inProjection: string,
  outProjection: string,
  options: { mutate?: boolean } = {}
): G {
  return convert(geojson, inProjection, outProjection, options);
}

/**
 * Converts a GeoJSON object into Mercator (EPSG:900913) projection
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
  return convert(geojson, "wgs84", "mercator", options);
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
  return convert(geojson, "mercator", "wgs84", options);
}

/**
 * Converts a GeoJSON coordinates to the defined `projection`
 *
 * @private
 * @param {GeoJSON} geojson GeoJSON Feature or Geometry
 * @param {string} inProjection defines the projection of the input coordinates, e.g. "WGS84"
 * @param {string} outProjection defines the projection of the output coordinates, e.g. "EPSG:3857"
 * @param {Object} [options] Optional parameters
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} Converted GeoJSON
 */
function convert(
  geojson: any,
  inProjection: string,
  outProjection: string,
  options: { mutate?: boolean } = {}
): any {
  // Optional parameters
  options = options || {};
  var mutate = options.mutate;

  // Validation
  if (!geojson) throw new Error("geojson is required");
  if (inProjection == undefined) throw new Error("inProjection is required");
  if (outProjection == undefined) throw new Error("outProjection is required");

  // Handle Position
  const isPosition = Array.isArray(geojson) && isNumber(geojson[0]);
  if (isPosition) {
    if (inProjection === "wgs84" && outProjection === "mercator") {
      geojson = convertToMercator(geojson);
    } else if (inProjection === "mercator" && outProjection === "wgs84") {
      geojson = convertToWgs84(geojson);
    } else {
      geojson = convertToProj4(geojson, inProjection, outProjection);
    }
  }
  // Handle GeoJSON
  else {
    // Handle possible data mutation
    if (mutate !== true) geojson = clone(geojson);

    coordEach(geojson, function (coord) {
      let newCoord = [];
      if (inProjection === "wgs84" && outProjection === "mercator") {
        newCoord = convertToMercator(coord);
      } else if (inProjection === "mercator" && outProjection === "wgs84") {
        newCoord = convertToWgs84(coord);
      } else {
        newCoord = convertToProj4(coord, inProjection, outProjection);
      }
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
 * Convert lon/lat values to any Proj4 projection.
 *
 * @private
 * @param {Array<number>} lonLat WGS84 point
 * @param {string} inProjection defines the proj4 projection of the input coordinates, e.g. "WGS84"
 * @param {string} outProjection defines the proj4 projection to convert the coordinates to, e.g. "EPSG:3857"
 * @returns {Array<number>} Projected [x, y] point
 */
function convertToProj4(lonLat: number[], inProjection: string, outProjection: string) {
  return proj4(inProjection, outProjection, lonLat);
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

export { toMercator, toWgs84, proj4ToProj4 };
