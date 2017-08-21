var gju = require('geojson-utils');
var meta = require('@turf/meta');
var Rbush = require('rbush');
var rbush = require('geojson-rbush');
var clone = require('@turf/clone');
var lineIntersect = require('@turf/line-intersect');
var helpers = require('@turf/helpers');
var turfbbox = require('@turf/bbox');
var invariant = require('@turf/invariant');
var turfUnion = require('@turf/union');
var getClosest = require('get-closest');
var overlap = require('@turf/boolean-overlap');
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
    var treeItems = [];
    var rtree = new Rbush();
    for (var polyIndex = 0; polyIndex < features.length; polyIndex++) {
        var inputFeatureBbox = turfbbox(features[polyIndex]);
        var treeObj = {
            minX: inputFeatureBbox[0],
            minY: inputFeatureBbox[1],
            maxX: inputFeatureBbox[2],
            maxY: inputFeatureBbox[3],
            origIndexPosition: polyIndex
        };
        treeItems.push(treeObj);
    }
    rtree.load(treeItems);


    for (var i in features) {

        var polygon = features[i];

        var polyBoundingBox = turfbbox(polygon);
        var searchObj = {
            minX: polyBoundingBox[0],
            minY: polyBoundingBox[1],
            maxX: polyBoundingBox[2],
            maxY: polyBoundingBox[3]
        };
        var potentialMatchingFeatures = rtree.search(searchObj);

        var featureChanged = false;

        for (var searchIndex in potentialMatchingFeatures) {
            polygon = features[i];

            var matchFeaturePosition = potentialMatchingFeatures[searchIndex].origIndexPosition;

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
if (polygon.geometry.type !== matchFeature.geometry.type) {
    var x = 1;
}
            if (!overlap(polygon, matchFeature) || !ringsIntersect(polygon, matchFeature)) continue;

            features[i] = turfUnion(polygon, matchFeature);
            if (features[i].geometry.type !== 'Polygon') {
                var y = 1;
            }
            originalIndexOfItemsRemoved.push(potentialMatchingFeatures[searchIndex].origIndexPosition);
            originalIndexOfItemsRemoved.sort(function (a, b) {
                return a - b;
            });

            rtree.remove(potentialMatchingFeatures[searchIndex]);
            features.splice(matchFeaturePosition, 1);
            searchObj.origIndexPosition = i;
            rtree.remove(searchObj, function (a, b) {
                return a.origIndexPosition === b.origIndexPosition;
            });
            featureChanged = true;
        }
        if (featureChanged) {
            var newBoundingBox = turfbbox(polygon);
            rtree.insert({
                minX: newBoundingBox[0],
                minY: newBoundingBox[1],
                maxX: newBoundingBox[2],
                maxY: newBoundingBox[3],
                origIndexPosition: i
            });
            i--;
        }
    }
    return fc;
};


function ringsIntersect(poly1, poly2) {
    var line1 = lineString(coordAll(poly1));
    var line2 = lineString(coordAll(poly2));
    var points = lineIntersect(line1, line2).features;
    return points.length > 0;
}
