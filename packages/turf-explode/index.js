var featureCollection = require('@turf/helpers').featureCollection;
var featureEach = require('@turf/meta').featureEach;
var coordEach = require('@turf/meta').coordEach;
var point = require('@turf/helpers').point;

/**
 * Takes a feature or set of features and returns all positions as {@link Point|points}.
 *
 * @name explode
 * @param {FeatureCollection|Feature<any>} geojson input features
 * @returns {FeatureCollection<point>} points representing the exploded input features
 * @throws {Error} if it encounters an unknown geometry type
 * @example
 * var polygon = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]
 *   }
 * };
 *
 * var explode = turf.explode(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, explode]
 */
module.exports = function (geojson) {
    var points = [];
    if (geojson.type === 'FeatureCollection') {
        featureEach(geojson, function (feature) {
            coordEach(feature, function (coord) {
                points.push(point(coord, feature.properties));
            });
        });
    } else {
        coordEach(geojson, function (coord) {
            points.push(point(coord, geojson.properties));
        });
    }
    return featureCollection(points);
};
