var inside = require('@turf/inside');

/**
 * Merges a specified property from a FeatureCollection of points into a
 * FeatureCollection of polygons. Given an `inProperty` on points and an `outProperty`
 * for polygons, this finds every point that lies within each polygon, collects the
 * `inProperty` values from those points, and adds them as an array to `outProperty`
 * on the polygon.
 *
 * @name collect
 * @param {FeatureCollection<Polygon>} polygons polygons with values on which to aggregate
 * @param {FeatureCollection<Point>} points points to be aggregated
 * @param {string} inProperty property to be nested from
 * @param {string} outProperty property to be nested into
 * @return {FeatureCollection<Polygon>} polygons with properties listed based on `outField`
 * @example
 * var poly1 = turf.polygon([[[0,0],[10,0],[10,10],[0,10],[0,0]]]);
 * var poly2 = turf.polygon([[[10,0],[20,10],[20,20],[20,0],[10,0]]]);
 * var polyFC = turf.featureCollection([poly1, poly2]);
 * var pt1 = turf.point([5,5], {population: 200});
 * var pt2 = turf.point([1,3], {population: 600});
 * var pt3 = turf.point([14,2], {population: 100});
 * var pt4 = turf.point([13,1], {population: 200});
 * var pt5 = turf.point([19,7], {population: 300});
 * var ptFC = turf.featureCollection([pt1, pt2, pt3, pt4, pt5]);
 * var collected = turf.collect(polyFC, ptFC, 'population', 'values');
 *
 * collected.features[0].properties.values // => [200, 600]);
 */
module.exports = function collect(polygons, points, inProperty, outProperty) {
    polygons.features.forEach(function (poly) {
        var values = points.features.filter(function (pt) {
            return inside(pt, poly);
        }).map(function (pt) {
            return pt.properties[inProperty];
        });

        if (!poly.properties) {
            poly.properties = {};
        }

        poly.properties[outProperty] = values;
    });

    return polygons;
};
