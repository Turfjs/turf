var helpers = require('@turf/helpers');
var meta = require('@turf/meta');
var lineSegment = require('@turf/line-segment');
var getCoords = require('@turf/invariant').getCoords;
var lineIntersect = require('@turf/line-intersect');
var rbush = require('geojson-rbush');
var clone = require('clone');
// var featureCollection = helpers.featureCollection;
var lineString = helpers.lineString;
var featureEach = meta.featureEach;
var featureReduce = meta.featureReduce;
var coordEach = meta.coordEach;

/**
 * Split a Polygon|LineString based on a target Polygon|LineString
 *
 * @name lineSplit
 * @param {Feature<LineString|Polygon>} source Feature to split
 * @param {Feature<LineString|Polygon>} target Feature used to find intersections
 * @returns {FeatureCollection<LineString>} Split lines
 */
module.exports = function (source, target) {
    var results = [];

    // Spatial Index
    var tree = rbush();
    tree.load(lineSegment(target));

    // Lines of 2-vertex
    var segments = lineSegment(source);
    var initialValue = segments.features[0];

    var last = featureReduce(segments, function (previous, current, index) {
        var matched = false;
        var lastCoord = getCoords(clone(current))[1];

        featureEach(tree.search(current), function (polySegment) {
            if (!matched) {
                // Segments match
                var intersect = lineIntersect(current, polySegment).features[0];
                if (intersect) {
                    // Create Segment
                    var newSegment = clone(previous);
                    if (index === 0) {
                        newSegment = lineString([getCoords(current)[0], getCoords(intersect)]);
                    } else {
                        newSegment.geometry.coordinates.push(getCoords(intersect));
                    }
                    // Push new split lines to results
                    if (validSegment(newSegment)) {
                        results.push(newSegment);
                    }
                    // Restart previous value to intersection point
                    previous.geometry.coordinates = [intersect.geometry.coordinates];
                    matched = true;
                }
            }
        });
        // Append last coordinate of current segment
        previous.geometry.coordinates.push(lastCoord);
        return previous;
    }, initialValue);

    // Add the end segment to the lineEnd of the line
    if (validSegment(last)) {
        results.push(last);
    }
    // Temporary Results
    return lineIntersect(source, target);
    // return featureCollection(results);
};

/**
 * Validate Segment - Must contain more than 1 unique point
 *
 * @private
 * @param {Feature<LineString>} segment Line Segment
 * @returns {boolean} true if segment is valid
 */
function validSegment(segment) {
    var uniques = {};
    coordEach(segment, function (coord) {
        uniques[coord.join(',')] = true;
    });
    return Object.keys(uniques).length > 1;
}
