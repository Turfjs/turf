var getCoords = require('@turf/invariant').getCoords;
var helpers = require('@turf/helpers');
var polygon = helpers.polygon;
var featureCollection = helpers.featureCollection;

/**
 * Converts a {@link LineString} or {@link MultiLineString} to a {@link Polygon}.
 *
 * @name lineStringToPolygon
 * @param {FeatureCollection|Feature<LineString|MultiLineString>} lines Features to convert
 * @param {boolean} [autoComplete=true] auto complete linestrings
 * @returns {FeatureCollection|Feature<Polygon>} converted to Polygons
 * @example
 * var line = {
 *   'type': 'Feature',
 *   'properties': {},
 *   'geometry': {
 *     'type': 'LineString',
 *     'coordinates': [[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]
 *   }
 * }
 * var polygon = turf.lineStringToPolygon(line);
 *
 * //addToMap
 * var addToMap = [polygon];
 */
module.exports = function (lines, autoComplete) {
    // validation
    if (!lines) throw new Error('lines is required');

    // default params
    autoComplete = (autoComplete !== undefined) ? autoComplete : true;
    var type = geomType(lines);

    switch (type) {
    case 'FeatureCollection':
    case 'GeometryCollection':
        var results = [];
        var features = (lines.features) ? lines.features : lines.geometries;
        features.forEach(function (line) {
            results.push(lineStringToPolygon(line, autoComplete));
        });
        return featureCollection(results);
    }
    return lineStringToPolygon(lines, autoComplete);
};

/**
 * LineString to Polygon
 *
 * @private
 * @param {Feature<LineString|MultiLineString>} line line
 * @param {boolean} [autoComplete=true] auto complete linestrings
 * @returns {Feature<Polygon>} line converted to Polygon
 */
function lineStringToPolygon(line, autoComplete) {
    var properties = line.properties;
    var coords = getCoords(line);
    var type = geomType(line);
    if (!coords.length) throw new Error('line must contain coordinates');

    switch (type) {
    case 'LineString':
        if (autoComplete) coords = autoCompleteCoords(coords);
        return polygon([coords], properties);
    case 'MultiLineString':
        if (autoComplete) coords.forEach(function (coord) {
            coord = autoCompleteCoords(coord);
        });
        return polygon(coords, properties);
    default:
        throw new Error('geometry type ' + type + ' is not supported');
    }
}

function geomType(feature) {
    return (feature.geometry) ? feature.geometry.type : feature.type;
}

function autoCompleteCoords(coords) {
    var first = coords[0];
    var x1 = first[0];
    var y1 = first[1];
    var last = coords[coords.length - 1];
    var x2 = last[0];
    var y2 = last[1];
    if (x1 !== x2 || y1 !== y2) {
        coords.push(first);
    }
    return coords;
}
