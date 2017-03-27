var flatten = require('@turf/flatten');
var pointOnLine = require('@turf/point-on-line');
var lineSegment = require('@turf/line-segment');
var getCoords = require('@turf/invariant').getCoords;
var lineIntersect = require('@turf/line-intersect');
var rbush = require('geojson-rbush');
var helpers = require('@turf/helpers');
var featureCollection = helpers.featureCollection;
var lineString = helpers.lineString;
var meta = require('@turf/meta');
var featureEach = meta.featureEach;
var featureReduce = meta.featureReduce;

/**
 * Split a LineString by another GeoJSON Feature.
 *
 * @name lineSplit
 * @param {Feature<LineString>} line LineString Feature to split
 * @param {Feature<Point|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon>} splitter Feature used to split line
 * @returns {FeatureCollection<LineString>} Split LineStrings
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [[120, -25], [145, -25]]
 *   }
 * };
 * var splitter = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [[130, -15], [130, -35]]
 *   }
 * };
 * var split = turf.lineSplit(line, splitter);
 * //=split
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
    var results = [];
    var tree = rbush();

    featureEach(splitter, function (point) {
        // Add index/id to features (needed for filter)
        results.forEach(function (feature, index) {
            feature.id = index;
        });
        // First Point - doesn't need to handle any previous line results
        if (!results.length) {
            results = splitLineWithPoint(line, point).features;
            tree.load(featureCollection(results));
        // Split with remaining points - lines might needed to be split multiple times
        } else {
            // Find all lines that are within the splitter's bbox
            var search = tree.search(point);

            // RBush might return multiple lines - only process the closest line to splitter
            var closestLine = findClosestFeature(point, search);

            // Remove closest line from results since this will be split into two lines
            // This removes any duplicates inside the results & index
            results = results.filter(function (feature) { return feature.id !== closestLine.id; });
            tree.remove(closestLine);

            // Append the two newly split lines into the results
            featureEach(splitLineWithPoint(closestLine, point), function (line) {
                results.push(line);
                tree.insert(line);
            });
        }
    });
    return featureCollection(results);
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
    var results = [];

    // Create spatial index
    var tree = rbush();
    var segments = lineSegment(line);
    tree.load(segments);

    // Find all segments that are within bbox of splitter
    var search = tree.search(splitter);

    // Return itself if point is not within spatial index
    if (!search.features.length) return featureCollection([line]);

    // RBush might return multiple lines - only process the closest line to splitter
    var closestSegment = findClosestFeature(splitter, search);

    // Initial value is the first point of the first segments (begining of line)
    var initialValue = [getCoords(segments.features[0])[0]];
    var lastCoords = featureReduce(segments, function (previous, current, index) {

        // Location where segment intersects with line
        if (index === closestSegment.id) {
            var coords = getCoords(splitter);
            previous.push(coords);
            results.push(lineString(previous));
            return [coords, getCoords(current)[1]];

        // Keep iterating over coords until finished or intersection is found
        } else {
            previous.push(getCoords(current)[1]);
            return previous;
        }
    }, initialValue);
    // Append last line to final split results
    results.push(lineString(lastCoords));
    return featureCollection(results);
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
