var distance = require('turf-distance');

/**
 * Takes a reference {@link Point|point} and a set of points and returns the point from the set closest to the reference.
 *
 * @module turf/nearest
 * @category classification
 * @param {Feature<Point>} point the reference point
 * @param {FeatureCollection<Point>} against input point set
 * @return {Feature<Point>} the closest point in the set to the reference point
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": "#0f0"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [28.965797, 41.010086]
 *   }
 * };
 * var against = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [28.973865, 41.011122]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [28.948459, 41.024204]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [28.938674, 41.013324]
 *       }
 *     }
 *   ]
 * };
 *
 * var nearest = turf.nearest(point, against);
 * nearest.properties['marker-color'] = '#f00';
 *
 * var resultFeatures = against.features.concat(point);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */
module.exports = function (targetPoint, points) {
    var nearestPoint;
    points.features.forEach(function (pt) {
        var dist;
        if (!nearestPoint) {
            nearestPoint = pt;
            dist = distance(targetPoint, pt, 'miles');
            nearestPoint.properties.distance = dist;
        } else {
            dist = distance(targetPoint, pt, 'miles');
            if (dist < nearestPoint.properties.distance) {
                nearestPoint = pt;
                nearestPoint.properties.distance = dist;
            }
        }
    });
    delete nearestPoint.properties.distance;
    return nearestPoint;
};
