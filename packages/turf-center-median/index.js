import centerMean from '@turf/center-mean';
import distance from '@turf/distance';
import centroid from '@turf/centroid';
import { isNumber, point, isObject, featureCollection } from '@turf/helpers';
import { featureEach } from '@turf/meta';
import { getCoord } from '@turf/invariant';

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
 * @param {FeatureCollection<Any>} features GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.weight] the property name used to weight the center
 * @param {number} [options.tolerance=0.001] the difference in distance between candidate medians at which point the algorighim stops iterating.
 * @param {number} [options.counter=10] how many attempts to find the median, should the tolerance be insufficient.
 * @returns {Feature<Point>} The median center of the collection
 * @example
 * var points = turf.featureCollection([turf.points[[0, 0], [1, 0], [0, 1], [5, 8]]);
 * var medianCenter = turf.centerMedian(points);
 *
 * //addToMap
 * var addToMap = [points, medianCenter]
 */
function centerMedian(features, options) {
    // Optional params
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var counter = options.counter || 10
    if (!isNumber(counter)) throw new Error('counter must be a number');
    var weightTerm = options.weight;

    // Calculate mean center:
    var meanCenter = centerMean(features, {weight: options.weight});

    // Calculate center of every feature:
    var centroids = [];
    featureEach(features, function (feature) { centroids.push(centroid(feature, {weight: feature.properties[weightTerm]})); });
    centroids = featureCollection(centroids);
    centroids.properties = {
        tolerance: options.tolerance,
        medianCandidates: []
    };
    return findMedian(meanCenter, [0, 0], centroids, counter);
}

/**
 * Recursive function to find new candidate medians.
 *
 * @private
 * @param {Feature<Position>} candidateMedian current candidate median
 * @param {Feature<Position>} previousCandidate the previous candidate median
 * @param {FeatureCollection<Point>} centroids the collection of centroids whose median we are determining
 * @param {number} counter how many attempts to try before quitting.
 * @returns {Feature<Point>} the median center of the dataset.
 */
function findMedian(candidateMedian, previousCandidate, centroids, counter) {
    var tolerance = centroids.properties.tolerance || 0.001;
    var candidateXsum = 0;
    var candidateYsum = 0;
    var kSum = 0;
    var centroidCount = 0;
    featureEach(centroids, function (theCentroid) {
        var weight = theCentroid.properties.weight;
        if (weight === 0 || weight < 0) {
          weight = 0;
        } else {
          if (!isNumber(weight)) throw new Error('weight value must be a number');
          weight = weight;
        }
        if (weight > 0) {
            centroidCount += 1;
            var distanceFromCandidate = weight * distance(theCentroid, candidateMedian);
            var k = weight / distanceFromCandidate;
            candidateXsum += getCoord(theCentroid)[0] * k;
            candidateYsum += getCoord(theCentroid)[1] * k;
            kSum += k;
        }
    });
    if (centroidCount < 1) throw new Error('no features to measure');
    var candidateX = candidateXsum / kSum;
    var candidateY = candidateYsum / kSum;
    if (centroidCount === 1 || counter === 0 || (Math.abs(candidateX - previousCandidate[0]) < tolerance && Math.abs(candidateY - previousCandidate[1]) < tolerance)) {
        return point([candidateX, candidateY], {medianCandidates: centroids.properties.medianCandidates});
    } else {
        centroids.properties.medianCandidates.push([candidateX, candidateY]);
        return findMedian([candidateX, candidateY], candidateMedian, centroids, counter - 1);
    }
}

export default centerMedian;

