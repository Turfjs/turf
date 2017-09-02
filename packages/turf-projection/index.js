var meta = require('@turf/meta');
var clone = require('@turf/clone');
var coordEach = meta.coordEach;

module.exports = {
    toMercator: toMercator,
    toWgs84: toWgs84
};

/**
 * Converts a WGS84 GeoJSON object into Mercator (EPSG:900913) projection
 *
 * @name toMercator
 * @param {GeoJSON} geojson WGS84 GeoJSON object
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} true/false
 * @example
 * var pt = turf.point([-71,41]);
 * var converted = turf.toMercator(pt);
 *
 * //addToMap
 * var addToMap = [pt, converted];
 */
function toMercator(geojson, mutate) {
    return convert(geojson, mutate, 'mercator');
}

/**
 * Converts a Mercator (EPSG:900913) GeoJSON object into WGS84 projection
 *
 * @name toWgs84
 * @param {GeoJSON} geojson Mercator GeoJSON object
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} true/false
 * @example
 * var pt = turf.point([-7903683.846322424, 5012341.663847514]);
 * var converted = turf.toWgs84(pt);
 *
 * //addToMap
 * var addToMap = [pt, converted];
 */
function toWgs84(geojson, mutate) {
    return convert(geojson, mutate, 'wgs84');
}


/**
 * Converts a GeoJSON coordinates to the defined `projection`
 *
 * @private
 * @param {GeoJSON} geojson GeoJSON Feature or Geometry
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @param {string} projection defines the projection system to convert the coordinates to
 * @returns {GeoJSON} true/false
 */
function convert(geojson, mutate, projection) {
    if (!geojson) throw new Error('geojson is required');

    if (mutate !== true) geojson = clone(geojson);

    coordEach(geojson, function (coord) {
        var newCoord = (projection === 'mercator') ? convertToMercator(coord) : convertToWgs84(coord);
        coord[0] = newCoord[0];
        coord[1] = newCoord[1];
    });

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
function convertToMercator(lonLat) {
    var D2R = Math.PI / 180,
        // 900913 properties
        A = 6378137.0,
        MAXEXTENT = 20037508.342789244;

    // compensate for 180th meridian issue
    // var longitude = (lonLat[0] > 180 || lonLat[0] < -180) ? lonLat[0] %= 180 : lonLat[0];
    // if (lonLat[0] > 180 || lonLat[0] < -180) lonLat[0] %= 180;
    var xy = [
        // A * longitude * D2R,
        A * lonLat[0] * D2R,
        A * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * lonLat[1] * D2R)))
    ];
    // compensate for 180th meridian issue
    // if (lonLat[0] > 180) xy[0] += A * 180 * D2R;
    // if (lonLat[0] < -180) xy[0] -= A * 180 * D2R;

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
function convertToWgs84(xy) {
    // 900913 properties.
    var R2D = 180 / Math.PI,
        A = 6378137.0;

    return [
        (xy[0] * R2D / A),
        ((Math.PI * 0.5) - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D
    ];
}
