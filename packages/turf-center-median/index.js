import centerMean from '@turf/center-mean';
import distance from '@turf/distance';
import centroid from '@turf/centroid';
import { isNumber, point, isObject, featureCollection } from '@turf/helpers';
import { featureEach } from '@turf/meta';

/**
 * Takes a {@link FeatureCollection} of points and calculates the median center,
 * algorithimically. The median center is understood as the point that is
 * requires the least total travel from all other points.
 *
 * Turfjs has four different functions for calculating the center of a set of
 * data. Each is useful depending on circumstance.
 *
 * `@turf/center` finds the simple center of a dataset, by finding the
 * midpoint between the extents of the data. That is, it divides in half the
 * farthest east and farthest west point as well as the farthest north and
 * farthest south.
 *
 * `@turf/center-of-mass` imagines that the dataset is a sheet of paper.
 * The center of mass is where the sheet would balance on a fingertip.
 *
 * `@turf/center-mean` takes the averages of all the coordinates and
 * produces a value that respects that. Unlike `@turf/center`, it is
 * sensitive to clusters and outliers. It lands in the statistical middle of a
 * dataset, not the geographical. It can also be weighted, meaning certain
 * points are more important than others.
 *
 * `@turf/center-median` takes the mean center and tries to find, iteratively,
 * a new point that requires the least amount of travel from all the points in
 * the dataset. It is not as sensitive to outliers as `@turf/center`, but it is
 * attracted to clustered data. It, too, can be weighted.
 *
 * **Bibliography**
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
 * @param {FeatureCollection<any>} features Any GeoJSON Feature Collection
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.weight] the property name used to weight the center
 * @param {number} [options.tolerance=0.001] the difference in distance between candidate medians at which point the algorighim stops iterating.
 * @param {number} [options.counter=10] how many attempts to find the median, should the tolerance be insufficient.
 * @returns {Feature<Point>} The median center of the collection
 * @example
 * var points = turf.points([[0, 0], [1, 0], [0, 1], [5, 8]]);
 * var medianCenter = turf.centerMedian(points);
 *
 * //addToMap
 * var addToMap = [points, medianCenter]
 */
function centerMedian(features, options) {
    // Optional params
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var counter = options.counter || 10;
    if (!isNumber(counter)) throw new Error('counter must be a number');
    var weightTerm = options.weight;

    // Calculate mean center:
    var meanCenter = centerMean(features, {weight: options.weight});

    // Calculate center of every feature:
    var centroids = featureCollection([]);
    featureEach(features, function (feature) {
        centroids.features.push(centroid(feature, {weight: feature.properties[weightTerm]}));
    });

    centroids.properties = {
        tolerance: options.tolerance,
        medianCandidates: []
    };
    return findMedian(meanCenter.geometry.coordinates, [0, 0], centroids, counter);
}

/**
 * Recursive function to find new candidate medians.
 *
 * @private
 * @param {Position} candidateMedian current candidate median
 * @param {Position} previousCandidate the previous candidate median
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
        var weightValue = theCentroid.properties.weight;
        var weight = (weightValue === undefined || weightValue === null) ? 1 : weightValue;
        weight = Number(weight);
        if (!isNumber(weight)) throw new Error('weight value must be a number');
        if (weight > 0) {
            centroidCount += 1;
            var distanceFromCandidate = weight * distance(theCentroid, candidateMedian);
            if (distanceFromCandidate === 0) distanceFromCandidate = 1;
            var k = weight / distanceFromCandidate;
            candidateXsum += theCentroid.geometry.coordinates[0] * k;
            candidateYsum += theCentroid.geometry.coordinates[1] * k;
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

