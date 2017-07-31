var rbush = require('rbush');
var union = require('@turf/union');
var helpers = require('@turf/helpers');
var turfBBox = require('@turf/bbox');
var flattenEach = require('@turf/meta').flattenEach;

/**
 * Takes any type of {@link Polygon|polygon} and an optional mask and returns a {@link Polygon|polygon} exterior ring with holes.
 *
 * @name mask
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>} polygon GeoJSON Polygon used as interior rings or holes.
 * @param {Feature<Polygon>} [mask] GeoJSON Polygon used as the exterior ring (if undefined, the world extent is used)
 * @returns {Feature<Polygon>} Masked Polygon (exterior ring with holes).
 * @example
 * var polygon = turf.polygon([[[112, -21], [116, -36], [146, -39], [153, -24], [133, -10], [112, -21]]]);
 * var mask = turf.polygon([[[90, -55], [170, -55], [170, 10], [90, 10], [90, -55]]]);
 *
 * var masked = turf.mask(polygon, mask);
 *
 * //addToMap
 * var addToMap = [masked]
 */
module.exports = function (polygon, mask) {
    // Define mask
    var maskPolygon = createMask(mask);

    // Define polygon
    var separated = separatePolygons(polygon);
    var polygonOuters = separated[0];
    var polygonInners = separated[1];

    // Union Outers & Inners
    polygonOuters = unionPolygons(polygonOuters);
    polygonInners = unionPolygons(polygonInners);

    // Create masked area
    var masked = buildMask(maskPolygon, polygonOuters, polygonInners);
    return masked;
};

/**
 * Build Mask
 *
 * @private
 * @param {Feature<Polygon>} maskPolygon Mask Outer
 * @param {FeatureCollection<Polygon>} polygonOuters Polygon Outers
 * @param {FeatureCollection<Polygon>} polygonInners Polygon Inners
 * @returns {Feature<Polygon>} Feature Polygon
 */
function buildMask(maskPolygon, polygonOuters, polygonInners) {
    var coordinates = [];
    coordinates.push(maskPolygon.geometry.coordinates[0]);

    flattenEach(polygonOuters, function (feature) {
        coordinates.push(feature.geometry.coordinates[0]);
    });

    flattenEach(polygonInners, function (feature) {
        coordinates.push(feature.geometry.coordinates[0]);
    });
    return helpers.polygon(coordinates);
}

/**
 * Separate Polygons to inners & outers
 *
 * @private
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>} polygon GeoJSON Feature
 * @returns {Array<FeatureCollection<Polygon>, FeatureCollection<Polygon>>} Outer & Inner lines
 */
function separatePolygons(polygon) {
    var outers = [];
    var inners = [];
    flattenEach(polygon, function (feature) {
        var coordinates = feature.geometry.coordinates;
        var featureOuter = coordinates[0];
        var featureInner = coordinates.slice(1);
        outers.push(helpers.polygon([featureOuter]));
        featureInner.forEach(function (inner) {
            inners.push(helpers.polygon([inner]));
        });
    });
    return [helpers.featureCollection(outers), helpers.featureCollection(inners)];
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
    return helpers.polygon(coordinates);
}

/**
 * Union Polygons
 *
 * @private
 * @param {FeatureCollection<Polygon>} polygons collection of polygons
 * @returns {FeatureCollection<Polygon>} polygons only apply union if they collide
 */
function unionPolygons(polygons) {
    if (polygons.features.length <= 1) return polygons;

    var tree = createIndex(polygons);
    var results = [];
    var removed = {};

    flattenEach(polygons, function (currentFeature, currentIndex) {
        // Exclude any removed features
        if (removed[currentIndex]) return true;

        // Don't search for itself
        tree.remove({index: currentIndex}, filterByIndex);
        removed[currentIndex] = true;

        // Keep applying the union operation until no more overlapping features
        while (true) {
            var bbox = turfBBox(currentFeature);
            var search = tree.search({
                minX: bbox[0],
                minY: bbox[1],
                maxX: bbox[2],
                maxY: bbox[3]
            });
            if (search.length > 0) {
                var polys = search.map(function (item) {
                    removed[item.index] = true;
                    tree.remove({index: item.index}, filterByIndex);
                    return item.geojson;
                });
                polys.push(currentFeature);
                currentFeature = union.apply(this, polys);
            }
            // Done
            if (search.length === 0) break;
        }
        results.push(currentFeature);
    });

    return helpers.featureCollection(results);
}

/**
 * Filter by Index - RBush helper function
 *
 * @private
 * @param {Object} a remove item
 * @param {Object} b search item
 * @returns {boolean} true if matches
 */
function filterByIndex(a, b) {
    return a.index === b.index;
}

/**
 * Create RBush Tree Index
 *
 * @private
 * @param {FeatureCollection<any>} features GeoJSON FeatureCollection
 * @returns {RBush} RBush Tree
 */
function createIndex(features) {
    var tree = rbush();
    var load = [];
    flattenEach(features, function (feature, index) {
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
