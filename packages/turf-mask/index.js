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
    // Define mask
    var maskCoordinates = createMask(mask);
    var maskOuter = maskCoordinates[0];
    var maskInners = maskCoordinates.slice(1);

    // Define polygon
    var separated = separatePolygonToLines(polygon);
    var polygonOuters = separated[0];
    var polygonInners = separated[1];

    // Create masked area
    var masked = buildMask(maskOuter, maskInners, polygonOuters, polygonInners);
    return masked;
};

/**
 * Build Mask
 *
 * @private
 * @param {line} maskOuter Mask Outer
 * @param {Array<line>} maskInners Mask Inners
 * @param {Array<line>} polygonOuters Polygon Outers
 * @param {Array<line>} polygonInners Polygon Inners
 * @returns {Feature<Polygon>} Feature Polygon
 */
function buildMask(maskOuter, maskInners, polygonOuters) {
    var coordinates = [maskOuter];
    polygonOuters.forEach(function (outer) {
        coordinates.push(outer);
    });
    return helpers.polygon(coordinates);
}

/**
 * Separate Polygons to inner & outer lines
 *
 * @private
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>} polygon GeoJSON Feature
 * @returns {Array<line[], line[]>} Outer & Inner lines
 */
function separatePolygonToLines(polygon) {
    var outers = [];
    var inners = [];
    featureEach(polygon, function (multiFeature) {
        if (multiFeature.geometry.type === 'MultiPolygon') {
            multiFeature = flattenMultiPolygon(multiFeature);
        }
        featureEach(multiFeature, function (feature) {
            var coordinates = feature.geometry.coordinates;
            var featureOuter = coordinates[0];
            var featureInner = coordinates.slice(1);
            outers.push(featureOuter);
            featureInner.forEach(function (inner) {
                inners.push(inner);
            });
        });
    });
    return [outers, inners];
}

/**
 * Flatten MultiPolygon
 *
 * @private
 * @param {Feature<MultiPolygon>} multiPolygon GeoJSON Feature
 * @returns {FeatureCollection<Polygon>} Feature Collection
 */
function flattenMultiPolygon(multiPolygon) {
    var polygons = [];
    multiPolygon.geometry.coordinates.forEach(function (coordinates) {
        polygons.push(helpers.polygon(coordinates));
    });
    return helpers.featureCollection(polygons);
}

/**
 * Create Mask Coordinates
 *
 * @private
 * @param {Feature<Polygon>} [mask] default to world if undefined
 * @returns {coordinates} mask coordinate
 */
function createMask(mask) {
    var world = [[[180, 90], [-180, 90], [-180, -90], [180, -90], [180, 90]]];
    var coordinates = mask && mask.geometry.coordinates || world;
    return coordinates;
}
