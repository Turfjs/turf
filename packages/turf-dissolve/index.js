var meta = require('@turf/meta');
var rbush = require('geojson-rbush');
var clone = require('@turf/clone');
var overlap = require('@turf/boolean-overlap');
var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
var turfUnion = require('@turf/union');
var getClosest = require('get-closest');
var lineIntersect = require('@turf/line-intersect');
var coordAll = meta.coordAll;
var lineString = helpers.lineString;
var collectionOf = invariant.collectionOf;

/**
 * Dissolves a FeatureCollection of polygons, filtered by an optional property name:value.
 * Note that multipart features within the collection are not supported
 *
 * @name dissolve
 * @param {FeatureCollection<Polygon>} featureCollection input feature collection to be dissolved
 * @param {string} [propertyName] features with equals 'propertyName' in `properties` will be merged
 * @returns {FeatureCollection<Polygon>} a FeatureCollection containing the dissolved polygons
 * @example
 * var features = turf.featureCollection([
 *   turf.polygon([[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]], {combine: 'yes'}),
 *   turf.polygon([[[0, -1], [0, 0], [1, 0], [1, -1], [0,-1]]], {combine: 'yes'}),
 *   turf.polygon([[[1,-1],[1, 0], [2, 0], [2, -1], [1, -1]]], {combine: 'no'}),
 * ]);
 *
 * var dissolved = turf.dissolve(features, 'combine');
 *
 * //addToMap
 * var addToMap = [features, dissolved]
 */
module.exports = function (featureCollection, propertyName) {
    collectionOf(featureCollection, 'Polygon', 'dissolve');

    var fc = clone(featureCollection);
    var features = fc.features;

    var originalIndexOfItemsRemoved = [];

    features.forEach(function (f, i) {
        f.properties.origIndexPosition = i;
    });
    var tree = rbush();
    tree.load(fc);

    for (var i in features) {
        var polygon = features[i];

        var featureChanged = false;

        for (var potentialMatchingFeature of tree.search(polygon).features) {
            polygon = features[i];

            var matchFeaturePosition = potentialMatchingFeature.properties.origIndexPosition;

            if (originalIndexOfItemsRemoved.length > 0 && matchFeaturePosition !== 0) {
                if (matchFeaturePosition > originalIndexOfItemsRemoved[originalIndexOfItemsRemoved.length - 1]) {
                    matchFeaturePosition = matchFeaturePosition - (originalIndexOfItemsRemoved.length);
                } else {
                    var closestNumber = getClosest.greaterNumber(matchFeaturePosition, originalIndexOfItemsRemoved);
                    if (closestNumber !== 0) {
                        matchFeaturePosition = matchFeaturePosition - closestNumber;
                    }
                }
            }

            if (matchFeaturePosition === +i) continue;

            var matchFeature = features[matchFeaturePosition];

            if (propertyName !== undefined &&
                matchFeature.properties[propertyName] !== polygon.properties[propertyName]) continue;

            if (!overlap(polygon, matchFeature) || !ringsIntersect(polygon, matchFeature)) continue;

            features[i] = turfUnion(polygon, matchFeature);

            originalIndexOfItemsRemoved.push(potentialMatchingFeature.properties.origIndexPosition);
            originalIndexOfItemsRemoved.sort(function (a, b) {
                return a - b;
            });

            tree.remove(potentialMatchingFeature);
            features.splice(matchFeaturePosition, 1);
            polygon.properties.origIndexPosition = i;
            tree.remove(polygon, function (a, b) {
                return a.properties.origIndexPosition === b.properties.origIndexPosition;
            });
            featureChanged = true;
        }

        if (featureChanged) {
            polygon.properties.origIndexPosition = i;
            tree.insert(polygon);
            i--;
        }
    }

    features.forEach(function (f) {
        delete f.properties.origIndexPosition;
        delete f.bbox;
    });

    return fc;
};


function ringsIntersect(poly1, poly2) {
    var line1 = lineString(coordAll(poly1));
    var line2 = lineString(coordAll(poly2));
    var points = lineIntersect(line1, line2).features;
    return points.length > 0;
}
