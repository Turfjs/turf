var inside = require('turf-inside');

/**
 * Joins attributes FeatureCollection of polygons with a FeatureCollection of
 * points. Given an `inProperty` on points and an `outProperty` for polygons,
 * this finds every point that lies within each polygon, collects the `inProperty`
 * values from those points, and adds them as an array to `outProperty` on the
 * polygon.
 *
 * @name collect
 * @category aggregation
 * @param {FeatureCollection<Polygon>} polygons polygons with values on which to aggregate
 * @param {FeatureCollection<Point>} points points to be aggregated
 * @param {Array} aggregations an array of aggregation objects
 * @return {FeatureCollection<Polygon>} polygons with properties listed based on `outField` values in `aggregations`
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
 *           [1.669921, 48.632908],
 *           [1.669921, 49.382372],
 *           [3.636474, 49.382372],
 *           [3.636474, 48.632908],
 *           [1.669921, 48.632908]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [2.230224, 47.85003],
 *           [2.230224, 48.611121],
 *           [4.361572, 48.611121],
 *           [4.361572, 47.85003],
 *           [2.230224, 47.85003]
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
 *         "coordinates": [2.054443,49.138596]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 600
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [3.065185,48.850258]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 100
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [2.329101,48.79239]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [2.614746,48.334343]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 300
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [3.416748,48.056053]
 *       }
 *     }
 *   ]
 * };
 * var aggregations = [
 *   {
 *     aggregation: 'sum',
 *     inField: 'population',
 *     outField: 'pop_sum'
 *   },
 *   {
 *     aggregation: 'average',
 *     inField: 'population',
 *     outField: 'pop_avg'
 *   },
 *   {
 *     aggregation: 'median',
 *     inField: 'population',
 *     outField: 'pop_median'
 *   },
 *   {
 *     aggregation: 'min',
 *     inField: 'population',
 *     outField: 'pop_min'
 *   },
 *   {
 *     aggregation: 'max',
 *     inField: 'population',
 *     outField: 'pop_max'
 *   },
 *   {
 *     aggregation: 'deviation',
 *     inField: 'population',
 *     outField: 'pop_deviation'
 *   },
 *   {
 *     aggregation: 'variance',
 *     inField: 'population',
 *     outField: 'pop_variance'
 *   },
 *   {
 *     aggregation: 'count',
 *     inField: '',
 *     outField: 'point_count'
 *   }
 * ];
 *
 * var aggregated = turf.aggregate(
 *   polygons, points, statsProperty);
 *
 * var result = turf.featurecollection(
 *   points.features.concat(aggregated.features));
 *
 * //=result
 */
module.exports = function collect(polyFC, ptFC, inProperty, outProperty) {
    polyFC.features.forEach(function (poly) {
        var values = ptFC.features.filter(function (pt) {
            return inside(pt, poly);
        }).map(function (pt) {
            return pt.properties[inProperty];
        });

        if (!poly.properties) {
            poly.properties = {};
        }

        poly.properties[outProperty] = values;
    });

    return polyFC;
};
