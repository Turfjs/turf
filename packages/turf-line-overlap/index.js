var lineSegment = require('@turf/line-segment');
var getCoords = require('@turf/invariant').getCoords;
var rbush = require('geojson-rbush');
var equal = require('deep-equal');
var featureCollection = require('@turf/helpers').featureCollection;
var featureEach = require('@turf/meta').featureEach;

/**
 * Takes any LineString or Polygon and returns the overlapping lines between both features.
 *
 * @name lineOverlap
 * @param {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} line1 any LineString or Polygon
 * @param {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} line2 any LineString or Polygon
 * @returns {FeatureCollection<LineString>} lines(s) that are overlapping between both features
 * @example
 * var line1 = turf.lineString([[115, -35], [125, -30], [135, -30], [145, -35]]);
 * var line2 = turf.lineString([[115, -25], [125, -30], [135, -30], [145, -25]]);
 *
 * var overlapping = turf.lineOverlap(line1, line2);
 *
 * //addToMap
 * var addToMap = [line1, line2, overlapping]
 */
module.exports = function (line1, line2) {
    var results = [];

    // Create Spatial Index
    var tree = rbush();
    tree.load(lineSegment(line1));
    var overlaps;

    // Iterate over line segments
    featureEach(lineSegment(line2), function (segment) {
        var doesOverlaps = false;
        featureEach(tree.search(segment), function (match) {
            if (doesOverlaps === false) {
                var coords1 = getCoords(segment).sort();
                var coords2 = getCoords(match).sort();

                // Segment overlaps feature
                if (equal(coords1, coords2)) {
                    doesOverlaps = true;
                    // Overlaps already exists - only append last coordinate of segment
                    if (overlaps) overlaps = concatSegment(overlaps, segment);
                    else overlaps = segment;
                }
            }
        });
        // Segment doesn't overlap - add overlaps to results & reset
        if (doesOverlaps === false && overlaps) {
            results.push(overlaps);
            overlaps = undefined;
        }
    });
    // Add last segment if exists
    if (overlaps) results.push(overlaps);

    return featureCollection(results);
};


/**
 * Concat Segment
 *
 * @private
 * @param {Feature<LineString>} line LineString
 * @param {Feature<LineString>} segment 2-vertex LineString
 * @returns {Feature<LineString>} concat linestring
 */
function concatSegment(line, segment) {
    var coords = getCoords(segment);
    var lineCoords = getCoords(line);
    var start = lineCoords[0];
    var end = lineCoords[lineCoords.length - 1];

    if (equal(coords[0], start)) {
        line.geometry.coordinates.unshift(coords[1]);
    } else if (equal(coords[0], end)) {
        line.geometry.coordinates.push(coords[1]);
    } else if (equal(coords[1], start)) {
        line.geometry.coordinates.unshift(coords[0]);
    } else if (equal(coords[1], end)) {
        line.geometry.coordinates.push(coords[0]);
    }
    return line;
}
