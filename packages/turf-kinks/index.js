/**
 * Takes a {@link Polygon|polygon} and returns {@link Point|points} at all self-intersections.
 *
 * @name kinks
 * @param {Feature<Polygon>|Polygon} polygon input polygon
 * @returns {FeatureCollection<Point>} self-intersections
 * @example
 * var poly = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-12.034835, 8.901183],
 *       [-12.060413, 8.899826],
 *       [-12.03638, 8.873199],
 *       [-12.059383, 8.871418],
 *       [-12.034835, 8.901183]
 *     ]]
 *   }
 * };
 *
 * var kinks = turf.kinks(poly);
 *
 * var resultFeatures = kinks.intersections.features.concat(poly);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */

var point = require('turf-helpers').point;

module.exports = function (polyIn) {
    var poly;
    var results = {
        type: 'FeatureCollection',
        features: []
    };
    if (polyIn.type === 'Feature') {
        poly = polyIn.geometry;
    } else {
        poly = polyIn;
    }
    poly.coordinates.forEach(function (ring1) {
        poly.coordinates.forEach(function (ring2) {
            for (var i = 0; i < ring1.length - 1; i++) {
                for (var k = 0; k < ring2.length - 1; k++) {
                    // don't check adjacent sides of a given ring, since of course they intersect in a vertex.
                    if (ring1 === ring2 && (Math.abs(i - k) === 1 || Math.abs(i - k) === ring1.length - 2)) {
                        continue;
                    }

                    var intersection = lineIntersects(ring1[i][0], ring1[i][1], ring1[i + 1][0], ring1[i + 1][1],
                        ring2[k][0], ring2[k][1], ring2[k + 1][0], ring2[k + 1][1]);
                    if (intersection) {
                        results.features.push(point([intersection[0], intersection[1]]));
                    }
                }
            }
        });
    });
    return results;
};


// modified from http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
function lineIntersects(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2,
        result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator === 0) {
        if (result.x !== null && result.y !== null) {
            return result;
        } else {
            return false;
        }
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a >= 0 && a <= 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b >= 0 && b <= 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    if (result.onLine1 && result.onLine2) {
        return [result.x, result.y];
    } else {
        return false;
    }
}
