var meta = require('@turf/meta');
var clone = require('@turf/clone');
var coordAll = meta.coordAll;

/**
 * <DESCRIPTION>
 *
 * @name toWgs84
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
* Convert 900913 x/y values to lon/lat.
* from https://github.com/mapbox/sphericalmercator
*
* @private
* @param {Array<number>} xy Mercator [x, y] point
* @returns {Array<number>} WGS84 [lon, lat] point
*/
function convert(xy) {
    // 900913 properties.
    var R2D = 180 / Math.PI,
        A = 6378137.0;

    return [
        (xy[0] * R2D / A),
        ((Math.PI * 0.5) - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D
    ];
}
