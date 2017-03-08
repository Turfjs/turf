var featureEach = require('@turf/meta').featureEach;
var rbush = require('rbush');
var turfBBox = require('@turf/bbox');
var helpers = require('@turf/helpers');
var lineString = helpers.lineString;
var polygon = helpers.polygon;
var featureCollection = helpers.featureCollection;

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
    var maskPolygon = createMask(mask);

    // Define polygon
    var separated = separatePolygonToLines(polygon);
    var polygonOuters = separated[0];
    var polygonInners = separated[1];

    // Union Outers & Inners
    // polygonOuters = unionLines(polygonOuters);

    // Create masked area
    var masked = buildMask(maskPolygon, polygonOuters, polygonInners);
    return masked;
};

/**
 * Build Mask
 *
 * @private
 * @param {Feature<Polygon>} maskPolygon Mask Outer
 * @param {FeatureCollection<LineString>} polygonOuters Polygon Outers
 * @param {FeatureCollection<LineString>} polygonInners Polygon Inners
 * @returns {Feature<Polygon>} Feature Polygon
 */
function buildMask(maskPolygon, polygonOuters, polygonInners) {
    var coordinates = maskPolygon.geometry.coordinates;

    featureEach(polygonOuters, function (feature) {
        coordinates.push(feature.geometry.coordinates);
    });

    featureEach(polygonInners, function (feature) {
        coordinates.push(feature.geometry.coordinates);
    });
    return polygon(coordinates);
}

/**
 * Separate Polygons to inner & outer lines
 *
 * @private
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>} polygon GeoJSON Feature
 * @returns {Array<FeatureCollection<LineString>, FeatureCollection<LineString>>} Outer & Inner lines
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
            outers.push(lineString(featureOuter));
            featureInner.forEach(function (inner) {
                inners.push(lineString(inner));
            });
        });
    });
    return [featureCollection(outers), featureCollection(inners)];
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
 * @returns {Feature<Polygon>} mask coordinate
 */
function createMask(mask) {
    var world = [[[180, 90], [-180, 90], [-180, -90], [180, -90], [180, 90]]];
    var coordinates = mask && mask.geometry.coordinates || world;
    return polygon(coordinates);
}

/**
 * Union Lines
 *
 * @private
 * @param {FeatureCollection<LineString>} lines an array of line coordinates
 * @returns {FeatureCollection<LineString>} lines that have been union if they collid
 */
function unionLines(lines) {
    var tree = createIndex(lines);
    var results = [];
    featureEach(lines, function (feature) {
        var bbox = turfBBox(feature);
        var search = tree.search({
            minX: bbox[0],
            minY: bbox[1],
            maxX: bbox[2],
            maxY: bbox[3]
        });
        console.log(search);
    });
    return featureCollection(results);
}

/**
 * Create RBush Tree Index
 *
 * @param {FeatureCollection<any>} features GeoJSON FeatureCollection
 * @returns {RBush} RBush Tree
 */
function createIndex(features) {
    var tree = rbush();
    var load = [];
    featureEach(features, function (feature, index) {
        var bbox = turfBBox(feature);
        load.push({
            minX: bbox[0],
            minY: bbox[1],
            maxX: bbox[2],
            maxY: bbox[3],
            geojson: feature,
            index: index
        });
    });
    tree.load(load);
    return tree;
}
