var turfUnion = require('@turf/union');
var turfOverlaps = require('turf-overlaps');
var turfbbox = require('@turf/bbox');
var Rbush = require('rbush');
var gju = require('geojson-utils');
var getClosest = require('get-closest');

/**
 * Dissolves a FeatureCollection of polygons based on a property. Note that multipart features within the collection are not supported
 *
 * @name dissolve
 * @param {FeatureCollection<Polygon>} featureCollection input feature collection to be dissolved
 * @param {string} [propertyName] property name on which to dissolve features
 * @returns {FeatureCollection<Polygon>} a FeatureCollection containing the dissolved polygons
 * @example
 * var features = turf.featureCollection([
 *   turf.polygon([[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]], {"combine": "yes"}),
 *   turf.polygon([[[0, -1], [0, 0], [1, 0], [1, -1], [0,-1]]], {"combine": "yes"}),
 *   turf.polygon([[[1,-1],[1, 0], [2, 0], [2, -1], [1, -1]]], {"combine": "no"}),
 * ]);
 *
 * var dissolved = turf.dissolve(features, 'combine');
 *
 * //addToMap
 * var addToMap = [features, dissolved]
 */
module.exports = function (featureCollection, propertyName) {

    var originalIndexOfItemsRemoved = [];
    var treeItems = [];
    var rtree = new Rbush();
    for (var polyIndex = 0; polyIndex < featureCollection.features.length; polyIndex++) {
        var inputFeatureBbox = turfbbox(featureCollection.features[polyIndex]);
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

    for (var i = 0; i < featureCollection.features.length; i++) {
        var polygon = featureCollection.features[i];

        var polyBoundingBox = turfbbox(polygon);
        var searchObj = {
            minX: polyBoundingBox[0],
            minY: polyBoundingBox[1],
            maxX: polyBoundingBox[2],
            maxY: polyBoundingBox[3]
        };
        var potentialMatchingFeatures = rtree.search(searchObj);

        var featureChanged = false;

        for (var searchIndex = 0; searchIndex < potentialMatchingFeatures.length; searchIndex++) {
            polygon = featureCollection.features[i];

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

            if (matchFeaturePosition === i) {
                continue;
            }
            var matchFeature = featureCollection.features[matchFeaturePosition];

            if (typeof propertyName !== undefined) {
                if (matchFeature.properties[propertyName] !== polygon.properties[propertyName]) {
                    continue;
                }
            }

            var overlapCheck = turfOverlaps(polygon, matchFeature);

            if (!overlapCheck) {
                var polyClone = JSON.stringify(polygon);
                var polyBeingCheckedClone = JSON.stringify(matchFeature);
                var linestring1 = toLinestring(JSON.parse(polyClone));
                var linestring2 = toLinestring(JSON.parse(polyBeingCheckedClone));
                overlapCheck = gju.lineStringsIntersect(linestring1.geometry, linestring2.geometry);
            }
            if (!overlapCheck) {
                continue;
            }

            featureCollection.features[i] = turfUnion(polygon, matchFeature);
            originalIndexOfItemsRemoved.push(potentialMatchingFeatures[searchIndex].origIndexPosition);
            originalIndexOfItemsRemoved.sort(function (a, b) {
                return a - b;
            });

            rtree.remove(potentialMatchingFeatures[searchIndex]);
            featureCollection.features.splice(matchFeaturePosition, 1);
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
    return featureCollection;
};

function toLinestring(polygon) {
    if (polygon === null || polygon === undefined) throw new Error('No polygon was passed');
    polygon.geometry.type = 'LineString';
    var flat_arr = [].concat.apply([], polygon.geometry.coordinates);
    polygon.geometry.coordinates = flat_arr;
    return polygon;
}
