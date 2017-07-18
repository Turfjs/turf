var invariant = require('@turf/invariant');
var clockwise = require('@turf/boolean-clockwise');
var getGeomType = invariant.getGeomType;

/**
 * Takes two features and returns true or false whether or not they overlap, i.e. whether any pair of edges
 * on the two polygons intersect. If there are any edge intersections, the polygons overlap.
 *
 * @name booleanOverlaps
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature1 input
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature2 input
 * @returns {boolean} true/false
 * @example
 * var poly1 = turf.polygon([[[18.70,-34.19],[18.93,-34.19],[18.93,-34],[18.70,-34],[18.70,-34.19]]]);
 * var poly2 = turf.polygon([[[18.52,-34.36],[18.79,-34.36],[18.79,-34.10],[18.52,-34.10],[18.52,-34.36]]]);
 * var line = turf.lineString([[18.62,-34.39],[18.87,-34.21]]);
 *
 * turf.booleanOverlaps(poly1, poly2)
 * //=true
 * turf.booleanOverlaps(poly2, line)
 * //=false
 */
module.exports = function (feature1, feature2) {
    // validation
    if (getGeomType(feature1) === 'Point') throw new Error('feature1 Point geometry not supported');
    if (getGeomType(feature2) === 'Point') throw new Error('feature2 Point geometry not supported');

    var coords1 = getCoordinatesArr(feature1),
        coords2 = getCoordinatesArr(feature2);

    // Since we don't care about the overlap amount, or it's geometry, but rather just whether overlap
    // occurs, polygon overlap can most simply be expressed by testing whether any pair of edges on the two polygons
    // intersect. If there are any edge intersections, the polygons overlap.

    // This looks completely stupid ridiculous to have so many nested loops, but it supports
    // multipolygons nicely. In the case of polygons or linestrings, the outer loops are only one iteration.
    return coords1.some(function (rings1) {
        return coords2.some(function (rings2) {
            return rings1.some(function (ring1) {
                return rings2.some(function (ring2) {
                    return doLinesIntersect(ring1, ring2);
                });
            });
        });
    });
};

/**
 * Returns if the two lineStrings intersect
 *
 * @private
 * @param {Array<Array<number|Array<number>>>} ring1 array of a LineString coordinates
 * @param {Array<Array<number|Array<number>>>} ring2 array of a LineString coordinates
 * @returns {boolean} lines intersect
 */
function doLinesIntersect(ring1, ring2) {
    for (var p1_ind = 0; p1_ind < (ring1.length - 1); p1_ind++) {
        var p1_line = [ring1[p1_ind], ring1[p1_ind + 1]];
        for (var p2_ind = 0; p2_ind < (ring2.length - 1); p2_ind++) {
            var p2_line = [ring2[p2_ind], ring2[p2_ind + 1]];

            if (doSegmentsIntersect(p1_line, p2_line)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Returns if the two segments intersect
 *
 * @private
 * @param {Array<Array<number>>} line1 array of a segment coordinates
 * @param {Array<Array<number>>} line2 array of a segment coordinates
 * @returns {boolean} segments intersect
 */
function doSegmentsIntersect(line1, line2) {
    var p1 = line1[0],
        p2 = line1[1],
        p3 = line2[0],
        p4 = line2[1];

    return (clockwise([p1, p3, p4, p1]) !== clockwise([p2, p3, p4, p2])) && (clockwise([p1, p2, p3, p1]) !== clockwise([p1, p2, p4, p1]));
}

/**
 * Takes a feature and returns nested Arrays containing the feature coordinates
 *
 * @private
 * @param {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature input
 * @returns {Array<Array<Array<number>>>} array of array of array of coordinates
 */
function getCoordinatesArr(feature) {
    switch (feature.geometry.type) {
    case 'LineString':
        return [[feature.geometry.coordinates]];
    case 'Polygon':
    case 'MultiLineString':
        return [feature.geometry.coordinates];
    case 'MultiPolygon':
        return feature.geometry.coordinates;
    }
    return [[[]]];
}
