import { featureCollection, isObject } from '../helpers';
import { collectionOf } from '../invariant';
import { featureEach } from '../meta';
import union from '../union';

/**
 * Dissolves a FeatureCollection of {@link polygon} features, filtered by an optional property name:value.
 * Note that {@link mulitpolygon} features within the collection are not supported
 *
 * @name dissolve
 * @param {FeatureCollection<Polygon>} fc input feature collection to be dissolved
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.propertyName] features with equals 'propertyName' in `properties` will be merged
 * @returns {FeatureCollection<Polygon>} a FeatureCollection containing the dissolved polygons
 * @example
 * var features = turf.featureCollection([
 *   turf.polygon([[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]], {combine: 'yes'}),
 *   turf.polygon([[[0, -1], [0, 0], [1, 0], [1, -1], [0,-1]]], {combine: 'yes'}),
 *   turf.polygon([[[1,-1],[1, 0], [2, 0], [2, -1], [1, -1]]], {combine: 'no'}),
 * ]);
 *
 * var dissolved = turf.dissolve(features, {propertyName: 'combine'});
 *
 * //addToMap
 * var addToMap = [features, dissolved]
 */
function dissolve(fc, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var propertyName = options.propertyName;

    // Input validation
    collectionOf(fc, 'Polygon', 'dissolve');

    // Main
    const outFeatures = [];
    if (options.propertyName === null) {
        return union(fc);
    } else {
        let uniquePropertyVals = {};
        featureEach(fc, function (feature) {
            if (!uniquePropertyVals.hasOwnProperty(feature.properties[propertyName])) {
                uniquePropertyVals[feature.properties[propertyName]] = [];
            }
            uniquePropertyVals[feature.properties[propertyName]].push(feature);
        });
        var vals = Object.keys(uniquePropertyVals);
        for (var i = 0; i < vals.length; i++) {
            outFeatures.push(union(featureCollection(uniquePropertyVals[vals[i]])));
        }
    }

    return featureCollection(outFeatures);
}

export default dissolve;
