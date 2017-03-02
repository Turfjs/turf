/**
 * Takes a {@link Polygon|polygon} and an optional mask and returns the outside area,
 * if you don't pass a mask polygon then the world is used.
 *
 * @name mask
 * @param {Feature<Polygon>} The input polygon
 * @param {Feature<Polygon>} [the world] A polygon to use as a mask
 * @return {Feature<Polygon>} Masked polygon
 * @example
 * var poylgon = {
 *     "type": "Feature",
 *     "properties": {},
 *     "geometry": {
 *       "type": "Polygon",
 *       "coordinates": [
 *         [[100, 0], [101, 0], [101,1], [100,1], [100, 0]]
 *      ]
 *    }
 * }
 *
 * var masked = turf.mask(polygon);
 * //=masked
 */

module.exports = function (polygon, mask) {
    if (typeof mask != 'undefined') {
        polygon.geometry.coordinates.push(mask.geometry.coordinates);
    } else {
        polygon.geometry.coordinates.push([[180, 90], [-180, 90], [-180, -90], [180, -90], [180, 90]]);
    }
    return polygon;
};
