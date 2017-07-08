var point = require('@turf/helpers').point;
var convex = require('@turf/convex');
var explode = require('@turf/explode');
var centroid = require('@turf/centroid');
var getCoord = require('@turf/invariant').getCoord;
var coordEach = require('@turf/meta').coordEach;

/**
 * Takes any {@link Feature} or a {@link FeatureCollection} and returns its [center of mass](https://en.wikipedia.org/wiki/Center_of_mass) using this formula: [Centroid of Polygon](https://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon).
 *
 * @param {GeoJSON} geojson GeoJSON to be centered
 * @param {Object} [properties] an Object that is used as the {@link Feature}'s properties
 * @returns {Feature<Point>} the center of mass
 * @example
 * var polygon = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]
 *   }
 * };
 *
 * var center = turf.centerOfMass(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, center]
 */
function centerOfMass(geojson, properties) {
    var type = (geojson.geometry) ? geojson.geometry.type : geojson.type;

    switch (type) {
    case 'Point':
        return point(getCoord(geojson), properties);
    case 'Polygon':
        var coords = [];
        coordEach(geojson, function (coord) {
            coords.push(coord);
        });

        // First, we neutralize the feature (set it around coordinates [0,0]) to prevent rounding errors
        // We take any point to translate all the points around 0
        var centre = centroid(geojson, properties);
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
            ], properties);
        }
    default:
        // Not a polygon: Compute the convex hull and work with that
        var hull = convex(explode(geojson));

        if (hull) {
            return centerOfMass(hull, properties);
        } else {
            // Hull is empty: fallback on the centroid
            return centroid(geojson, properties);
        }
    }
}

module.exports = centerOfMass;
