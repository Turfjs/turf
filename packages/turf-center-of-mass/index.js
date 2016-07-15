var each = require('@turf/meta').coordEach,
    centroid = require('@turf/centroid'),
    point = require('@turf/helpers').point;

/**
 * Takes a [feature](http://geojson.org/geojson-spec.html#feature-objects) and returns its
 * [center of mass](https://en.wikipedia.org/wiki/Center_of_mass) using this formulae:
 * [Centroid of Polygon](https://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon)..
 *
 * @name center-of-mass
 * @param {Feature} feature - the feature
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
 * var centerOfMass = turf.center-of-mass(feature);
 *
 * //=centerOfMass
 */
module.exports = function (feature) {
    var points = [];
    each(feature, function (coord) {
        points.push(coord);
    });

    // First, we neutralize the feature (set it around coordinates [0,0]) to prevent rounding errors
    // We take any point to translate all the points around 0
    var translation = points[0];
    var neutralizedPoints = [];
    var length = points.length;
    var sx = 0;
    var sy = 0;
    var sArea = 0;
    var i, pi, pj, xi, xj, yi, yj, a;

    for (i = 0; i < points.length; i++) {
        neutralizedPoints.push([
            points[i][0] - translation[0],
            points[i][1] - translation[1]
        ]);
    }

    for (i = 0; i < length - 1; i++) {
        // pi is the current point
        pi = neutralizedPoints[i];
        xi = pi[0];
        yi = pi[1];

        // pj is the next point (pi+1)
        pj = neutralizedPoints[i + 1];
        xj = pj[0];
        yj = pj[1];

        // a is the common factor to compute the signed area and the final coordinates
        a = (xi * yj - xj * yi);

        // sArea is the sum used to compute the signed area
        sArea += a;

        // sx and sy are the sums used to compute the final coordinates
        sx += (xi + xj) * a;
        sy += (yi + yj) * a;
    }

    // Shape has no area: fallback on turf.centroid
    if (sArea === 0) {
        return centroid(feature);
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
};
