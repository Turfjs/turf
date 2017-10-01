import pointToLineDistance from '@turf/point-to-line-distance';
import { featureEach, geomEach } from '@turf/meta';

/**
 * Returns the closest {@link Point|point}, of a {@link FeatureCollection|collection} of points, to a {@link LineString|line}.
 * The returned point has a `dist` property indicating its distance to the line.
 *
 * @name nearestPointToLine
 * @param {FeatureCollection|GeometryCollection<Point>} points Point Collection
 * @param {Feature|Geometry<LineString>} line Line Feature
 * @param {Object} [options] Optional parameters
 * @param {string} [options.units=kilometers] unit of the output distance property, can be degrees, radians, miles, or kilometer
 * @returns {Feature<Point>} the closest point
 * @example
 * var pt1 = turf.point([0, 0]);
 * var pt2 = turf.point([0.5, 0.5]);
 * var points = turf.featureCollection([pt1, pt2]);
 * var line = turf.lineString([[1,1], [-1,1]]);
 *
 * var nearest = turf.nearestPointToLine(points, line);
 *
 * //addToMap
 * var addToMap = [nearest, line];
 */
function nearestPointToLine(points, line, options) {
    // Backwards compatible with v4.0
    var units = (typeof options === 'object') ? options.units : options;

    // validation
    if (!points) throw new Error('points is required');
    points = handleCollection(points);
    if (!points.features.length) throw new Error('points must contain features');

    if (!line) throw new Error('line is required');
    var type = line.geometry ? line.geometry.type : line.type;
    if (type !== 'LineString') throw new Error('line must be a LineString');

    var dist = Infinity;
    var pt = null;

    featureEach(points, function (point) {
        var d = pointToLineDistance(point, line, { units: units });
        if (d < dist) {
            dist = d;
            pt = point;
        }
    });
    pt.properties.dist = dist;
    return pt;
}

/**
 * Convert Collection to FeatureCollection
 *
 * @private
 * @param {FeatureCollection|GeometryCollection<Point>} points Points
 * @returns {FeatureCollection<Point>} points
 */
function handleCollection(points) {
    var features = [];
    var type = points.geometry ? points.geometry.type : points.type;
    switch (type) {
    case 'GeometryCollection':
        geomEach(points, function (geom) {
            if (geom.type === 'Point') features.push({type: 'Feature', properties: {}, geometry: geom});
        });
        return {type: 'FeatureCollection', features: features};
    case 'FeatureCollection':
        points.features = points.features.filter(function (feature) {
            return feature.geometry.type === 'Point';
        });
        return points;
    default:
        throw new Error('points must be a Point Collection');
    }
}

export default nearestPointToLine;
