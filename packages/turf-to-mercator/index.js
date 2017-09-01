var meta = require('@turf/meta');
var clone = require('@turf/clone');
var coordAll = meta.coordAll;

/**
 * <DESCRIPTION>
 *
 * @name toMercator
 * @param {GeoJSON} geojson GeoJSON Feature or Geometry
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} true/false
 * @example
 * <SIMPLE EXAMPLE>
 */
module.exports = function (geojson, mutate) {
    if (!geojson) throw new Error('geojson is required');

    if (mutate !== true) geojson = clone(geojson);

    coordAll(geojson, function (coord) {
        coord = convert(coord);
    });

    return geojson;
};

/**
 * Convert lon/lat values to 900913 x/y.
 * from https://github.com/mapbox/sphericalmercator
 *
 * @private
 * @param {Array<number>} lonLat WGS84 point
 * @returns {Array<number>} Mercator [x, y] point
 */
function convert(lonLat) {
    var D2R = Math.PI / 180,
        // 900913 properties
        A = 6378137.0,
        MAXEXTENT = 20037508.342789244;

    var xy = [
        A * lonLat[0] * D2R,
        A * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * lonLat[1] * D2R)))
    ];
    // if xy value is beyond maxextent (e.g. poles), return maxextent
    if (xy[0] > MAXEXTENT) xy[0] = MAXEXTENT;
    if (xy[0] < -MAXEXTENT) xy[0] = -MAXEXTENT;
    if (xy[1] > MAXEXTENT) xy[1] = MAXEXTENT;
    if (xy[1] < -MAXEXTENT) xy[1] = -MAXEXTENT;

    return xy;
}
