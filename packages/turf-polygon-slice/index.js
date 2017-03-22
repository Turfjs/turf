var rbush = require('geojson-rbush');
var clone = require('clone');
var meta = require('@turf/meta');
var helpers = require('@turf/helpers');
var getCoords = require('@turf/invariant').getCoords;
var lineSegment = require('@turf/line-segment');
var lineIntersect = require('@turf/line-intersect');
var featureCollection = helpers.featureCollection;
var lineString = helpers.lineString;
var coordEach = meta.coordEach;
var featureEach = meta.featureEach;
var featureReduce = meta.featureReduce;

/**
 * Slices {@link Polygon} using a {@link Linestring}.
 *
 * @name polygonSlice
 * @param {Feature<Polygon>} polygon Polygon to slice
 * @param {Feature<LineString>} linestring LineString used to slice Polygon
 * @returns {FeatureCollection<Polygon>} Sliced Polygons
 * @example
 * var polygon = {
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *         [0, 0],
 *         [0, 10],
 *         [10, 10],
 *         [10, 0],
 *         [0, 0]
 *     ]]
 *   }
 * };
 * var linestring =  {
 *     "type": "Feature",
 *     "properties": {},
 *     "geometry": {
 *       "type": "LineString",
 *       "coordinates": [
 *         [5, 15],
 *         [5, -15]
 *       ]
 *     }
 *   }
 * var sliced = turf.polygonSlice(polygon, linestring);
 * //=sliced
*/
module.exports = function polygonSlice(polygon, linestring) {
    linestring = clone(linestring);
    polygon = clone(polygon);

    var splitLines = lineSplit(linestring, polygon);
    var splitPolygons = lineSplit(polygon, linestring);

    return featureCollection(splitLines.features.concat(splitPolygons.features));
};

/**
 * Split a Polygon|LineString based on a target Polygon|LineString
 *
 * @private
 * @param {Feature<LineString|Polygon>} source Feature to split
 * @param {Feature<LineString|Polygon>} target Feature used to find intersections
 * @returns {FeatureCollection<LineString>} Split lines
 */
function lineSplit(source, target) {
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
    return featureCollection(results);
}

/**
 * Validate Segment - Must contain more than 1 unique point
 *
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
