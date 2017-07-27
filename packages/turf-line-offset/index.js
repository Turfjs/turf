var meta = require('@turf/meta');
var helpers = require('@turf/helpers');
var getCoords = require('@turf/invariant').getCoords;
var intersection = require('./intersection');
var flattenEach = meta.flattenEach;
var lineString = helpers.lineString;
var multiLineString = helpers.multiLineString;
var distanceToDegrees = helpers.distanceToDegrees;

/**
 * Takes a {@link LineString|line} and returns a {@link LineString|line} at offset by the specified distance.
 *
 * @name lineOffset
 * @param {Geometry|Feature<LineString|MultiLineString>} geojson input GeoJSON
 * @param {number} distance distance to offset the line (can be of negative value)
 * @param {string} [units=kilometers] can be degrees, radians, miles, kilometers, inches, yards, meters
 * @returns {Feature<LineString|MultiLineString>} Line offset from the input line
 * @example
 * var line = turf.lineString([[-83, 30], [-84, 36], [-78, 41]], { "stroke": "#F00" });
 *
 * var offsetLine = turf.lineOffset(line, 2, "miles");
 *
 * //addToMap
 * var addToMap = [offsetLine, line]
 * offsetLine.properties.stroke = "#00F"
 */
module.exports = function (geojson, distance, units) {
    if (!geojson) throw new Error('geojson is required');
    if (distance === undefined || distance === null || isNaN(distance)) throw new Error('distance is required');
    var type = (geojson.type === 'Feature') ? geojson.geometry.type : geojson.type;
    var properties = geojson.properties;

    switch (type) {
    case 'LineString':
        return lineOffset(geojson, distance, units);
    case 'MultiLineString':
        var coords = [];
        flattenEach(geojson, function (feature) {
            coords.push(lineOffset(feature, distance, units).geometry.coordinates);
        });
        return multiLineString(coords, properties);
    default:
        throw new Error('geometry ' + type + ' is not supported');
    }
};

/**
 * Line Offset
 *
 * @private
 * @param {Geometry|Feature<LineString>} line input line
 * @param {number} distance distance to offset the line (can be of negative value)
 * @param {string} [units=kilometers] units
 * @returns {Feature<LineString>} Line offset from the input line
 */
function lineOffset(line, distance, units) {
    var segments = [];
    var offsetDegrees = distanceToDegrees(distance, units);
    var coords = getCoords(line);
    var finalCoords = [];
    coords.forEach(function (currentCoords, index) {
        if (index !== coords.length - 1) {
            var segment = processSegment(currentCoords, coords[index + 1], offsetDegrees);
            segments.push(segment);
            if (index > 0) {
                var seg2Coords = segments[index - 1];
                var intersects = intersection(segment, seg2Coords);

                // Handling for line segments that aren't straight
                if (intersects !== false) {
                    seg2Coords[1] = intersects;
                    segment[0] = intersects;
                }

                finalCoords.push(seg2Coords[0]);
                if (index === coords.length - 2) {
                    finalCoords.push(segment[0]);
                    finalCoords.push(segment[1]);
                }
            }
            // Handling for lines that only have 1 segment
            if (coords.length === 2) {
                finalCoords.push(segment[0]);
                finalCoords.push(segment[1]);
            }
        }
    });
    return lineString(finalCoords, line.properties);
}

/**
 * Process Segment
 * Inspiration taken from http://stackoverflow.com/questions/2825412/draw-a-parallel-line
 *
 * @private
 * @param {Array<number>} point1 Point coordinates
 * @param {Array<number>} point2 Point coordinates
 * @param {number} offset Offset
 * @returns {Array<Array<number>>} offset points
 */
function processSegment(point1, point2, offset) {
    var L = Math.sqrt((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1]));

    var out1x = point1[0] + offset * (point2[1] - point1[1]) / L;
    var out2x = point2[0] + offset * (point2[1] - point1[1]) / L;
    var out1y = point1[1] + offset * (point1[0] - point2[0]) / L;
    var out2y = point2[1] + offset * (point1[0] - point2[0]) / L;
    return [[out1x, out1y], [out2x, out2y]];
}
