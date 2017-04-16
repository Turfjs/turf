var inside = require('@turf/inside');

/**
 * Takes a set of {@link Point|points} and a set of {@link Polygon|polygons} and performs a spatial join.
 *
 * @name tag
 * @param {FeatureCollection<Point>} points input points
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @param {string} field property in `polygons` to add to joined {<Point>} features
 * @param {string} outField property in `points` in which to store joined property from `polygons`
 * @returns {FeatureCollection<Point>} points with `containingPolyId` property containing values from `polyId`
 * @example
 * var pt1 = turf.point([-77, 44]);
 * var pt2 = turf.point([-77, 38]);
 * var poly1 = turf.polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]], {pop: 3000});
 * var poly2 = turf.polygon([[
 *   [-81, 35],
 *   [-81, 41],
 *   [-72, 41],
 *   [-72, 35],
 *   [-81, 35]
 * ]], {pop: 1000});
 *
 * var points = turf.featureCollection([pt1, pt2]);
 * var polygons = turf.featureCollection([poly1, poly2]);
 *
 * var tagged = turf.tag(points, polygons, 'pop', 'population');
 *
 * //addToMap
 * var addToMap = [tagged, polygons]
 */
module.exports = function (points, polygons, field, outField) {
    // prevent mutations
    points = JSON.parse(JSON.stringify(points));
    polygons = JSON.parse(JSON.stringify(polygons));
    points.features.forEach(function (pt) {
        if (!pt.properties) {
            pt.properties = {};
        }
        polygons.features.forEach(function (poly) {
            if (pt.properties[outField] === undefined) {
                var isInside = inside(pt, poly);
                if (isInside) {
                    pt.properties[outField] = poly.properties[field];
                }
            }
        });
    });
    return points;
};
