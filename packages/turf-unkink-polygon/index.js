var simplepolygon = require('simplepolygon');
var flatten = require('@turf/flatten');
var featureEach = require('@turf/meta').featureEach;
var featureCollection = require('@turf/helpers').featureCollection;

/**
 * Takes a kinked polygon and returns a feature collection of polygons that have no kinks.
 * Uses [simplepolygon](https://github.com/mclaeysb/simplepolygon) internally.
 *
 * @name unkinkPolygon
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>} geojson GeoJSON Polygon or MultiPolygon
 * @returns {FeatureCollection<Polygon>} Unkinked polygons
 * @example
 * var poly = turf.polygon([[[0, 0], [2, 0], [0, 2], [2, 2], [0, 0]]]);
 *
 * var result = turf.unkinkPolygon(poly);
 *
 * //addToMap
 * var addToMap = [poly, result]
 */
module.exports = function (geojson) {
    var results = featureCollection([]);

    // Handles FeatureCollection & Feature
    featureEach(geojson, function (feature) {

        // Handle MultiPolygons as Feature or FeatureCollection
        if (feature.geometry.type === 'MultiPolygon') { feature = flatten(feature); }

        // Store simple polygons in results
        featureEach(feature, function (polygon) {
            var simple = simplepolygon(polygon);

            featureEach(simple, function (poly) {
                poly.properties = (polygon.properties) ? polygon.properties : {};
                results.features.push(poly);
            });
        });
    });
    return results;
};
