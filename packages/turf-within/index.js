var inside = require('@turf/inside');
var featureCollection = require('@turf/helpers').featureCollection;

/**
 * Takes a set of {@link Point|points} and a set of {@link Polygon|polygons} and returns the points that fall within the polygons.
 *
 * @name within
 * @param {FeatureCollection<Point>} points input points
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @returns {FeatureCollection<Point>} points that land within at least one polygon
 * @example
 * var searchWithin = turf.featureCollection([
 *     turf.polygon([[
 *         [-46.653,-23.543],
 *         [-46.634,-23.5346],
 *         [-46.613,-23.543],
 *         [-46.614,-23.559],
 *         [-46.631,-23.567],
 *         [-46.653,-23.560],
 *         [-46.653,-23.543]
 *     ]])
 * ]);
 * var points = turf.featureCollection([
 *     turf.point([-46.6318, -23.5523]),
 *     turf.point([-46.6246, -23.5325]),
 *     turf.point([-46.6062, -23.5513]),
 *     turf.point([-46.663, -23.554]),
 *     turf.point([-46.643, -23.557])
 * ]);
 *
 * var ptsWithin = turf.within(points, searchWithin);
 *
 * //addToMap
 * var addToMap = [points, searchWithin, ptsWithin]
 * turf.featureEach(ptsWithin, function (currentFeature) {
 *   currentFeature.properties['marker-size'] = 'large';
 *   currentFeature.properties['marker-color'] = '#000';
 * });
 */
module.exports = function (points, polygons) {
    var pointsWithin = featureCollection([]);
    for (var i = 0; i < polygons.features.length; i++) {
        for (var j = 0; j < points.features.length; j++) {
            var isInside = inside(points.features[j], polygons.features[i]);
            if (isInside) {
                pointsWithin.features.push(points.features[j]);
            }
        }
    }
    return pointsWithin;
};
