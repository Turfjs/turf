var each = require('@turf/meta').coordEach,
    centroid = require('@turf/centroid'),
    convex = require('@turf/convex'),
    explode = require('@turf/explode'),
    point = require('@turf/helpers').point;

/**
 * Takes a [feature](http://geojson.org/geojson-spec.html#feature-objects)
 * or a [featureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)
 * and returns its [center of mass](https://en.wikipedia.org/wiki/Center_of_mass)
 * using this formula: [Centroid of Polygon](https://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon).
 *
 * @param {FeatureCollection|Feature} fc - the feature collection or feature
 * @returns {Feature<Point>} the center of mass
 * @example
 * var feature = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [
 *       [
 *         [
 *           4.854240417480469,
 *           45.77258200374433
 *         ],
 *         [
 *           4.8445844650268555,
 *           45.777431068484894
 *         ],
 *         [
 *           4.845442771911621,
 *           45.778658234059755
 *         ],
 *         [
 *           4.845914840698242,
 *           45.779376562352425
 *         ],
 *         [
 *           4.846644401550292,
 *           45.78021460033108
 *         ],
 *         [
 *           4.847245216369629,
 *           45.78078326178593
 *         ],
 *         [
 *           4.848060607910156,
 *           45.78138184652523
 *         ],
 *         [
 *           4.8487043380737305,
 *           45.78186070968964
 *         ],
 *         [
 *           4.849562644958495,
 *           45.78248921135124
 *         ],
 *         [
 *           4.850893020629883,
 *           45.78302792142197
 *         ],
 *         [
 *           4.852008819580077,
 *           45.78374619341895
 *         ],
 *         [
 *           4.852995872497559,
 *           45.784075398324866
 *         ],
 *         [
 *           4.853854179382324,
 *           45.78443452873236
 *         ],
 *         [
 *           4.8549699783325195,
 *           45.78470387501975
 *         ],
 *         [
 *           4.85569953918457,
 *           45.784793656826345
 *         ],
 *         [
 *           4.857330322265624,
 *           45.784853511283764
 *         ],
 *         [
 *           4.858231544494629,
 *           45.78494329284938
 *         ],
 *         [
 *           4.859304428100585,
 *           45.784883438488365
 *         ],
 *         [
 *           4.858360290527344,
 *           45.77294120818474
 *         ],
 *         [
 *           4.854240417480469,
 *           45.77258200374433
 *         ]
 *       ]
 *     ]
 *   }
 * };
 *
 * var centerOfMass = turf.centerOfMass(feature);
 *
 * //=centerOfMass
 */
function centerOfMass(fc) {
    if (fc.type === 'Feature' && fc.geometry.type === 'Polygon') {
        var coords = [];
        each(fc, function (coord) {
            coords.push(coord);
        });

        // First, we neutralize the feature (set it around coordinates [0,0]) to prevent rounding errors
        // We take any point to translate all the points around 0
        var centre = centroid(fc);
        var translation = centre.geometry.coordinates;
        var sx = 0;
        var sy = 0;
        var sArea = 0;
        var i, pi, pj, xi, xj, yi, yj, a;

        var neutralizedPoints = coords.map(function (point) {
            return [
                point[0] - translation[0],
                point[1] - translation[1]
            ];
        });

        for (i = 0; i < coords.length - 1; i++) {
            // pi is the current point
            pi = neutralizedPoints[i];
            xi = pi[0];
            yi = pi[1];

            // pj is the next point (pi+1)
            pj = neutralizedPoints[i + 1];
            xj = pj[0];
            yj = pj[1];

            // a is the common factor to compute the signed area and the final coordinates
            a = xi * yj - xj * yi;

            // sArea is the sum used to compute the signed area
            sArea += a;

            // sx and sy are the sums used to compute the final coordinates
            sx += (xi + xj) * a;
            sy += (yi + yj) * a;
        }

        // Shape has no area: fallback on turf.centroid
        if (sArea === 0) {
            return centre;
        } else {
            // Compute the signed area, and factorize 1/6A
            var area = sArea * 0.5;
            var areaFactor = 1 / (6 * area);

            // Compute the final coordinates, adding back the values that have been neutralized
            return point([
                translation[0] + areaFactor * sx,
                translation[1] + areaFactor * sy
            ]);
        }
    } else {
        // Not a polygon: Compute the convex hull and work with that
        var hull = convex(explode(fc));

        if (hull) {
            return module.exports(hull);
        } else {
            // Hull is empty: fallback on the centroid
            return centroid(fc);
        }
    }
}

module.exports = centerOfMass;
