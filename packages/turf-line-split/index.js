var meta = require('@turf/meta');
var rbush = require('geojson-rbush');
var helpers = require('@turf/helpers');
var flatten = require('@turf/flatten');
var truncate = require('@turf/truncate');
var invariant = require('@turf/invariant');
var lineSegment = require('@turf/line-segment');
var pointOnLine = require('@turf/point-on-line');
var lineIntersect = require('@turf/line-intersect');
var getCoords = invariant.getCoords;
var lineString = helpers.lineString;
var getGeomType = invariant.getGeomType;
var featureEach = meta.featureEach;
var featureReduce = meta.featureReduce;
var featureCollection = helpers.featureCollection;

/**
 * Split a LineString by another GeoJSON Feature.
 *
 * @name lineSplit
 * @param {Feature<LineString>} line LineString Feature to split
 * @param {Feature} splitter Feature used to split line
 * @returns {FeatureCollection<LineString>} Split LineStrings
 * @example
 * var line = turf.lineString([[120, -25], [145, -25]]);
 * var splitter = turf.lineString([[130, -15], [130, -35]]);
 *
 * var split = turf.lineSplit(line, splitter);
 *
 * //addToMap
 * var addToMap = [line, splitter]
 */
module.exports = function (line, splitter) {
    if (!line) throw new Error('line is required');
    if (!splitter) throw new Error('splitter is required');

    var lineType = getGeomType(line);
    var splitterType = getGeomType(splitter);

    if (lineType !== 'LineString') throw new Error('line must be LineString');
    if (splitterType === 'FeatureCollection') throw new Error('splitter cannot be a FeatureCollection');
    if (splitterType === 'GeometryCollection') throw new Error('splitter cannot be a GeometryCollection');

    // remove excessive decimals from splitter
    // to avoid possible approximation issues in rbush
    var truncatedSplitter = truncate(splitter, 7);

    switch (splitterType) {
    case 'Point':
        return splitLineWithPoint(line, truncatedSplitter);
    case 'MultiPoint':
        return splitLineWithPoints(line, flatten(truncatedSplitter));
    case 'LineString':
    case 'MultiLineString':
    case 'Polygon':
    case 'MultiPolygon':
        return splitLineWithPoints(line, lineIntersect(line, truncatedSplitter));
    }
};

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
 * Split LineString with Point
 *
 * @private
 * @param {Feature<LineString>} line LineString
 * @param {Feature<Point>} splitter Point
 * @returns {FeatureCollection<LineString>} split LineStrings
 */
function splitLineWithPoint(line, splitter) {
    var results = [];

    // handle endpoints
    var startPoint = getCoords(line)[0];
    var endPoint = getCoords(line)[line.geometry.coordinates.length - 1];
    if (pointsEquals(startPoint, getCoords(splitter)) ||
        pointsEquals(endPoint, getCoords(splitter))) return featureCollection([line]);

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

    // Initial value is the first point of the first segments (beginning of line)
    var initialValue = [startPoint];
    var lastCoords = featureReduce(segments, function (previous, current, index) {
        var currentCoords = getCoords(current)[1];
        var splitterCoords = getCoords(splitter);

        // Location where segment intersects with line
        if (index === closestSegment.id) {
            previous.push(splitterCoords);
            results.push(lineString(previous));
            // Don't duplicate splitter coordinate (Issue #688)
            if (pointsEquals(splitterCoords, currentCoords)) return [splitterCoords];
            return [splitterCoords, currentCoords];

        // Keep iterating over coords until finished or intersection is found
        } else {
            previous.push(currentCoords);
            return previous;
        }
    }, initialValue);
    // Append last line to final split results
    if (lastCoords.length > 1) {
        results.push(lineString(lastCoords));
    }
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
    if (!lines.features) throw new Error('<lines> must contain features');
    // Filter to one segment that is the closest to the line
    if (lines.features.length === 1) return lines.features[0];

    var closestFeature;
    var closestDistance = Infinity;
    featureEach(lines, function (segment) {
        var pt = pointOnLine(segment, point);
        var dist = pt.properties.dist;
        if (dist < closestDistance) {
            closestFeature = segment;
            closestDistance = dist;
        }
    });
    return closestFeature;
}

/**
 * Compares two points and returns if they are equals
 *
 * @private
 * @param {Array<number>} pt1 point
 * @param {Array<number>} pt2 point
 * @returns {boolean} true if they are equals
 */
function pointsEquals(pt1, pt2) {
    return pt1[0] === pt2[0] && pt1[1] === pt2[1];
}
