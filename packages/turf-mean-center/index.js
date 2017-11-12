import { featureEach } from '@turf/meta';
import { point, isNumber } from '@turf/helpers';
import { getCoords } from '@turf/invariant';

/**
 * Takes a {@link FeatureCollection} of {@link Point} and returns the mean center. Can be weighted.
 *
 * @name meanCenter
 * @param {FeatureCollection<Point>} collection input FeatureCollection of points
 * @param {string} weight the name of the property used to weight the center
 * @returns {Feature<Point>} a Point feature at the mean center of the input features
 * @example
 * var weights = [10, 5, 1, 1];
 * var coords = [[0, 0], [0, 5], [5, 0], [5, 5]];
 * var points = turf.featureCollection(coords.map(function(coord, i){
 *     return turf.point(coord, {weight: weights[i]});
 * }));
 * var meanCenterPoint = turf.meanCenter(points);
 * var weightedMeanCenterPoint = turf.meanCenter(points, 'weight');
 *
 * //addToMap
 * var addToMap = [meanCenterPoint, weightedMeanCenterPoint, points];
 */
function meanCenter(collection, weight) {
    var sumXs = 0;
    var sumYs = 0;
    var sumNs = 0;
    featureEach(collection, function (point, i) {
        var w = point.properties[weight] || 1;
        if (!isNumber(w)) throw new Error('Weight for feature index ' + i + ' is not a number!');
        sumXs += getCoords(point)[0] * w;
        sumYs += getCoords(point)[1] * w;
        sumNs += w;
    });
    if (sumNs === 0) throw new Error('Sum of weights is equal to zero!');
    return point([sumXs / sumNs, sumYs / sumNs]);
}

export default meanCenter;
