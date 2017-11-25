import centerMean from '@turf/center-mean';
import distance from '@turf/distance';
import { point, isObject, isNumber } from '@turf/helpers';
import { featureEach, getCoords } from '@turf/meta';

/**
 * Takes a {@link FeatureCollection} of points and calculates the median center,
 * algorithimically. It uses the algorithm described in:
 *
 * Harold W. Kuhn and Robert E. Kuenne, “An Efficient Algorithm for the
 * Numerical Solution of the Generalized Weber Problem in Spatial
 * Economics,” _Journal of Regional Science_ 4, no. 2 (1962): 21–33,
 * doi:{@link https://doi.org/10.1111/j.1467-9787.1962.tb00902.x}.
 *
 * James E. Burt, Gerald M. Barber, and David L. Rigby, _Elementary
 * Statistics for Geographers_, 3rd ed., New York: The Guilford
 * Press, 2009, 150–151.
 *
 * @name centerMedian
 * @param {FeatureCollection<Point>} features GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.weight] the property name used to weight the center
 * @param {number} [options.tolerance=0.001] the difference in distance between candidate medians at which point the algorighim stops iterating.
 * @returns {Feature<Point>} The median center of the collection
 * @example
 * var points;
 * var medianCenter = turf.centerMedian(points);
 *
 * //addToMap
 * var addToMap = [points, medianCenter]
 */
function centerMedian(features, options) {
    // Optional params
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var weightTerm = options.weight;
    var tolerance = options.tolerance || 0.001;

    // Validation:
    if (!isNumber(tolerance)) throw new Error('tolerance must be a number');

    // Calculate mean center & number of features:
    var meanCenter = centerMean(features, {weight: weightTerm});

    function findMedian(candidateMedian, prevCandidate) {
        var medianCandidates = [];
        var candidateXsum = 0;
        var candidateYsum = 0;
        var kSum = 0;
        featureEach(features, function (feature) {
            var weight = feature.properties[weightTerm] || 1;
            var distanceFromCandidate = weight * distance(feature, candidateMedian);
            var k = weight / distanceFromCandidate;
            candidateXsum += getCoords(feature)[0] * k;
            candidateYsum += getCoords(feature)[1] * k;
            kSum += k;
        });
        var candidateX = candidateXsum / kSum;
        var candidateY = candidateYsum / kSum;
        if (Math.abs(candidateX - prevCandidate[0]) < tolerance && Math.abs(candidateY - prevCandidate[1]) < tolerance) {
            return point([candidateX, candidateY], {medianCandidates: medianCandidates});
        } else {
            medianCandidates.push([candidateX, candidateY]);
            return findMedian([candidateX, candidateY], candidateMedian);
        }
    }
    return findMedian(meanCenter, [0, 0]);
}

export default centerMedian;
