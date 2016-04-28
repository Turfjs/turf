// http://cs.selu.edu/~rbyrd/math/midpoint/
// ((x1+x2)/2), ((y1+y2)/2)
var invariant = require('turf-invariant');

/**
 * Takes two {@link Point|points} and returns a point midway between them.
 * This gives the middle point in terms of latitude and longitude averaging,
 * so the midpoint is guaranteed to fall on the line on an equirectangular
 * projection, but may not be halfway between the points on the globe.
 *
 * @name midpoint
 * @category measurement
 * @param {Feature<Point>} pt1 first point
 * @param {Feature<Point>} pt2 second point
 * @return {Feature<Point>} a point midway between `pt1` and `pt2`
 * @example
 * var pt1 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [144.834823, -37.771257]
 *   }
 * };
 * var pt2 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [145.14244, -37.830937]
 *   }
 * };
 *
 * var midpointed = turf.midpoint(pt1, pt2);
 * midpointed.properties['marker-color'] = '#f00';
 *
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [pt1, pt2, midpointed]
 * };
 *
 * //=result
 */
module.exports = function (point1, point2) {
    var coords1 = invariant.getCoord(point1);
    var coords2 = invariant.getCoord(point2);
    return {
        type: 'Point',
        coordinates: [
            (coords1[0] + coords2[0]) / 2,
            (coords1[1] + coords2[1]) / 2
        ]
    };
};
