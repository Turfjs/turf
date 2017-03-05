const helpers = require('@turf/helpers');
const featureEach = require('@turf/meta').featureEach;

/**
 * Takes any type of {@link Polygon|polygon} and an optional mask and returns a {@link Polygon|polygon} exterior ring with holes.
 *
 * @name mask
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>} polygon GeoJSON Polygon used as interior rings or holes.
 * @param {Feature<Polygon>} [mask] GeoJSON Polygon used as the exterior ring (if undefined, the world extent is used)
 * @return {Feature<Polygon>} Masked Polygon (exterior ring with holes).
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
 * var masked = turf.mask(polygon);
 * //=masked
 */
module.exports = function (polygon, mask) {
    var world = helpers.polygon([[[180, 90], [-180, 90], [-180, -90], [180, -90], [180, 90]]]);
    var result = JSON.parse(JSON.stringify(mask || world));

    featureEach(polygon, function (feature) {
        var coordinates = feature.geometry.coordinates;
        result.geometry.coordinates.push(coordinates[0]);
    });
    return result;
};
