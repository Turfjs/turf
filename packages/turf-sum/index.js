var inside = require('turf-inside');

/**
 * Calculates the sum of a field for a set of {@link Point|points} within a set of {@link Polygon|polygons}.
 *
 * @module turf/sum
 * @category aggregation
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @param {FeatureCollection<Point>} points input points
 * @param {String} inField the field in input data to analyze
 * @param {String} outField the field in which to store results
 * @return {FeatureCollection<Polygon>} polygons
 * with properties listed as `outField`
 * @example
 * var polygons = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [-87.990188, 43.026486],
 *           [-87.990188, 43.062115],
 *           [-87.913284, 43.062115],
 *           [-87.913284, 43.026486],
 *           [-87.990188, 43.026486]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [-87.973709, 42.962452],
 *           [-87.973709, 43.014689],
 *           [-87.904014, 43.014689],
 *           [-87.904014, 42.962452],
 *           [-87.973709, 42.962452]
 *         ]]
 *       }
 *     }
 *   ]
 * };
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-87.974052, 43.049321]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 600
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-87.957229, 43.037277]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 100
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-87.931137, 43.048568]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-87.963409, 42.99611]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 300
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-87.94178, 42.974762]
 *       }
 *     }
 *   ]
 * };
 *
 * var aggregated = turf.sum(
 *   polygons, points, 'population', 'sum');
 *
 * var resultFeatures = points.features.concat(
 *   aggregated.features);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */
module.exports = function (polyFC, ptFC, inField, outField) {
    polyFC.features.forEach(function (poly) {
        if (!poly.properties) {
            poly.properties = {};
        }
        var values = [];
        ptFC.features.forEach(function (pt) {
            if (inside(pt, poly)) {
                values.push(pt.properties[inField]);
            }
        });
        poly.properties[outField] = sum(values);
    });

    return polyFC;
};

function sum(x) {
    var value = 0;
    for (var i = 0; i < x.length; i++) {
        value += x[i];
    }
    return value;
}
