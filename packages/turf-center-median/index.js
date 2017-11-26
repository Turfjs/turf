import centerMean from '@turf/center-mean';
import distance from '@turf/distance';
import centroid from '@turf/centroid';
import { point, isObject, featureCollection } from '@turf/helpers';
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
 * @param {FeatureCollection<Point>} features GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.weight] the property name used to weight the center
 * @param {number} [options.tolerance=0.001] the difference in distance between candidate medians at which point the algorighim stops iterating.
 * @returns {Feature<Point>} The median center of the collection
 * @example
 * var points = turf.featureCollection([turf.point([0, 0], turf.point([1, 0]), turf.point([0, 1]), turf.point([5, 8])]);
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
    return findMedian(meanCenter, [0, 0], centroids);
}

/**
 * Recursive function to find new candidate medians.
 *
 * @private
 * @param {Feature<Position>} candidateMedian current candidate median
 * @param {Feature<Position>} previousCandidate the previous candidate median
 * @param {FeatureCollection<Point>} centroids the collection of centroids whose median we are determining
 * @returns {Feature<Point>} the median center of the dataset.
 */
function findMedian(candidateMedian, previousCandidate, centroids) {
    var tolerance = centroids.properties.tolerance || 0.001;
    var candidateXsum = 0;
    var candidateYsum = 0;
    var kSum = 0;
    featureEach(centroids, function (theCentroid) {
        var weight = theCentroid.properties.weight || 1;
        var distanceFromCandidate = weight * distance(theCentroid, candidateMedian);
        var k = weight / distanceFromCandidate;
        candidateXsum += getCoord(theCentroid)[0] * k;
        candidateYsum += getCoord(theCentroid)[1] * k;
        kSum += k;
    });
    var candidateX = candidateXsum / kSum;
    var candidateY = candidateYsum / kSum;
    if (Math.abs(candidateX - previousCandidate[0]) < tolerance && Math.abs(candidateY - previousCandidate[1]) < tolerance) {
        return point([candidateX, candidateY], {medianCandidates: centroids.properties.medianCandidates});
    } else {
        centroids.properties.medianCandidates.push([candidateX, candidateY]);
        return findMedian([candidateX, candidateY], candidateMedian, centroids);
    }
}

export default centerMedian;

