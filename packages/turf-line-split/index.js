var pointOnLine = require('@turf/point-on-line');
var helpers = require('@turf/helpers');
var meta = require('@turf/meta');
var featureEach = meta.featureEach;
var featureReduce = meta.featureReduce;
var lineSegment = require('@turf/line-segment');
var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;
// var lineIntersect = require('@turf/line-intersect');
var rbush = require('geojson-rbush');
var featureCollection = helpers.featureCollection;
var lineString = helpers.lineString;

/**
 * Split a Polygon|LineString based on a target Polygon|LineString
 *
 * @name lineSplit
 * @param {Feature<LineString>} line LineString Feature to split
 * @param {Feature<LineString|MultiLineString|Polygon|MultiPolygon|Point|MultiPoint>} splitter Feature used to split
 * @returns {FeatureCollection<LineString>} Split LineStrings
 */
module.exports = function (line, splitter) {
    var results = [];
    if (geomType(line) !== 'LineString') throw new Error('<line> must be LineString');
    if (geomType(splitter) === 'FeatureCollection') throw new Error('<splitter> cannot be a FeatureCollection');

    switch (geomType(splitter)) {
    case 'Point':
        results = splitLineWithPoint(line, splitter).features;
    }
    return featureCollection(results);
};

/**
 * Retrieves Geometry Type from GeoJSON
 *
 * @param {Feature<any>} geojson Feature
 * @returns {string} Geometry Type
 */
function geomType(geojson) {
    return (geojson.geometry) ? geojson.geometry.type : geojson.type;
}

/**
 * Split LineString with MultiPoint
 *
 * @param {Feature<LineString>} line LineString
 * @param {Feature<Point>} splitter Point
 * @returns {FeatureCollection<LineString>} split LineStrings
 */
function splitLineWithPoint(line, splitter) {
    // Create spatial index
    var tree = rbush();
    var segments = lineSegment(line);
    tree.load(segments);
    var search = tree.search(splitter);

    // Return itself if point is not within spatial index
    if (!search.features.length) return featureCollection([line]);

    // Filter to one segment that is the closest to the line
    var closestDistance;
    var closestSegment;
    if (search.features.length > 1) {
        featureEach(search, function (segment) {
            var point = pointOnLine(segment, splitter);
            if (closestDistance === undefined) {
                closestSegment = segment;
                closestDistance = point.properties.dist;
            } else if (point.properties.dist < closestDistance) {
                closestSegment = segment;
                closestDistance = point.properties.dist;
            }
        });
    } else { closestSegment = search.features[0]; }

    // Split lines
    var lines = [];
    var initialValue = [getCoords(segments.features[0])[0]]; // First point of segments
    var lastCoords = featureReduce(segments, function (previous, current, index) {
        if (index === closestSegment.id) {
            var coords = getCoords(splitter);
            previous.push(coords);
            lines.push(lineString(previous));
            return [coords, getCoords(current)[1]];
        } else {
            previous.push(getCoords(current)[1]);
            return previous;
        }
    }, initialValue);
    lines.push(lineString(lastCoords));
    return featureCollection(lines);
}
