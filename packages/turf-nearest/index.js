var distance = require('@turf/distance');

/**
 * Takes a reference {@link Point|point} and a FeatureCollection of Features
 * with Point geometries and returns the
 * point from the FeatureCollection closest to the reference. This calculation
 * is geodesic.
 *
 * @name nearest
 * @param {Geometry|Feature<Point>|Array<number>} targetPoint the reference point
 * @param {FeatureCollection<Point>} points against input point set
 * @returns {Feature<Point>} the closest point in the set to the reference point
 * @example
 * var targetPoint = turf.point([28.965797, 41.010086], {"marker-color": "#0F0"});
 * var points = turf.featureCollection([
 *     turf.point([28.973865, 41.011122]),
 *     turf.point([28.948459, 41.024204]),
 *     turf.point([28.938674, 41.013324])
 * ]);
 *
 * var nearest = turf.nearest(targetPoint, points);
 *
 * //addToMap
 * var addToMap = [targetPoint, points, nearest];
 * nearest.properties['marker-color'] = '#F00';
 */
module.exports = function (targetPoint, points) {
    var nearestPoint, minDist = Infinity;
    for (var i = 0; i < points.features.length; i++) {
        var distanceToPoint = distance(targetPoint, points.features[i], 'miles');
        if (distanceToPoint < minDist) {
            nearestPoint = points.features[i];
            minDist = distanceToPoint;
        }
    }
    return nearestPoint;
};
