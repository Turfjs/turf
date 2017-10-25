import { point } from '@turf/helpers';

/**
 * Takes a {@link LineString|linestring}, {@link MultiLineString|multi-linestring}, {@link MultiPolygon|multi-polygon}, or {@link Polygon|polygon} and returns {@link Point|points} at all self-intersections.
 *
 * @name kinks
 * @param {Feature<LineString|MultiLineString|MultiPolygon|Polygon>} featureIn input feature
 * @returns {FeatureCollection<Point>} self-intersections
 * @example
 * var poly = turf.polygon([[
 *   [-12.034835, 8.901183],
 *   [-12.060413, 8.899826],
 *   [-12.03638, 8.873199],
 *   [-12.059383, 8.871418],
 *   [-12.034835, 8.901183]
 * ]]);
 *
 * var kinks = turf.kinks(poly);
 *
 * //addToMap
 * var addToMap = [poly, kinks]
 */
function kinks(featureIn) {
    var coordinates;
    var feature;
    var results = {
        type: 'FeatureCollection',
        features: []
    };
    if (featureIn.type === 'Feature') {
        feature = featureIn.geometry;
    } else {
        feature = featureIn;
    }
    if (feature.type === 'LineString') {
        coordinates = [feature.coordinates];
    } else if (feature.type === 'MultiLineString') {
        coordinates = feature.coordinates;
    } else if (feature.type === 'MultiPolygon') {
        coordinates = [].concat.apply([], feature.coordinates);
    } else if (feature.type === 'Polygon') {
        coordinates = feature.coordinates;
    } else {
        throw new Error('Input must be a LineString, MultiLineString, ' +
            'Polygon, or MultiPolygon Feature or Geometry');
    }
    coordinates.forEach(function (line1) {
        coordinates.forEach(function (line2) {
            for (var i = 0; i < line1.length - 1; i++) {
                // start iteration at i, intersections for k < i have already been checked in previous outer loop iterations
                for (var k = i; k < line2.length - 1; k++) {
                    if (line1 === line2) {
                        // segments are adjacent and always share a vertex, not a kink
                        if (Math.abs(i - k) === 1) {
                            continue;
                        }
                        // first and last segment in a closed lineString or ring always share a vertex, not a kink
                        if (
                            // segments are first and last segment of lineString
                            i === 0 &&
                            k === line1.length - 2 &&
                            // lineString is closed
                            line1[i][0] === line1[line1.length - 1][0] &&
                            line1[i][1] === line1[line1.length - 1][1]
                        ) {
                            continue;
                        }
                    }

                    var intersection = lineIntersects(line1[i][0], line1[i][1], line1[i + 1][0], line1[i + 1][1],
                        line2[k][0], line2[k][1], line2[k + 1][0], line2[k + 1][1]);
                    if (intersection) {
                        results.features.push(point([intersection[0], intersection[1]]));
                    }
                }
            }
        });
    });
    return results;
}


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

export default kinks;
