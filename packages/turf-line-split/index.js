var flatten = require('@turf/flatten');
var pointOnLine = require('@turf/point-on-line');
var helpers = require('@turf/helpers');
var meta = require('@turf/meta');
var featureEach = meta.featureEach;
var featureReduce = meta.featureReduce;
var lineSegment = require('@turf/line-segment');
var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;
var lineIntersect = require('@turf/line-intersect');
var rbush = require('geojson-rbush');
var featureCollection = helpers.featureCollection;
var lineString = helpers.lineString;

/**
 * Split a LineString by another GeoJSON Feature.
 *
 * @name lineSplit
 * @param {Feature<LineString>} line LineString Feature to split
 * @param {Feature<Point|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon>} splitter Feature used to split line
 * @returns {FeatureCollection<LineString>} Split LineStrings
 */
module.exports = function (line, splitter) {
    if (geomType(line) !== 'LineString') throw new Error('<line> must be LineString');
    if (geomType(splitter) === 'FeatureCollection') throw new Error('<splitter> cannot be a FeatureCollection');

    switch (geomType(splitter)) {
    case 'Point':
        return splitLineWithPoint(line, splitter);
    case 'MultiPoint':
        return splitLineWithPoints(line, flatten(splitter));
    case 'LineString':
    case 'MultiLineString':
    case 'Polygon':
    case 'MultiPolygon':
        return splitLineWithPoints(line, lineIntersect(line, splitter));
    default:
        throw new Error('<splitter> geometry type is not supported');
    }
};

/**
 * Retrieves Geometry Type from GeoJSON
 *
 * @private
 * @param {Feature<any>} geojson Feature
 * @returns {string} Geometry Type
 */
function geomType(geojson) {
    return (geojson.geometry) ? geojson.geometry.type : geojson.type;
}

/**
 * Split LineString with MultiPoint
 *
 * @private
 * @param {Feature<LineString>} line LineString
 * @param {FeatureCollection<Point>} splitter Point
 * @returns {FeatureCollection<LineString>} split LineStrings
 */
function splitLineWithPoints(line, splitter) {
    var tree = rbush();
    var lines = [];
    featureEach(splitter, function (point) {
        // Add index/id to features
        lines.forEach(function (feature, index) {
            feature.id = index;
        });
        // First Point
        if (!lines.length) {
            lines = splitLineWithPoint(line, point).features;
            tree.load(featureCollection(lines));
        // Split with remaining points
        } else {
            var search = tree.search(point);
            var closestLine = findClosestFeature(point, search);

            // Remove closest line from results (will be split)
            lines = lines.filter(function (feature) { return feature.id !== closestLine.id; });
            tree.remove(closestLine);

            // Split lines
            featureEach(splitLineWithPoint(closestLine, point), function (line) {
                lines.push(line);
                tree.insert(line);
            });
        }
    });
    return featureCollection(lines);
}

/**
 * Split LineString with MultiPoint
 *
 * @private
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

    var closestSegment = findClosestFeature(splitter, search);

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

/**
 * Find Closest Feature
 *
 * @private
 * @param {Feature<Point>} point Feature must be closest to this point
 * @param {FeatureCollection<LineString>} lines Collection of Features
 * @returns {Feature<LineString>} closest LineString
 */
function findClosestFeature(point, lines) {
        // Filter to one segment that is the closest to the line
    var closestDistance;
    var closestFeature;
    if (!lines.features) throw new Error('<lines> must contain features');
    if (lines.features.length === 1) return lines.features[0];

    featureEach(lines, function (segment) {
        var pt = pointOnLine(segment, point);
        var dist = pt.properties.dist;
        if (closestDistance === undefined) {
            closestFeature = segment;
            closestDistance = dist;
        } else if (dist < closestDistance) {
            closestFeature = segment;
            closestDistance = dist;
        }
    });
    return closestFeature;
}
