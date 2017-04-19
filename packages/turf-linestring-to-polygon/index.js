var getCoords = require('@turf/invariant').getCoords;
var helpers = require('@turf/helpers');
var polygon = helpers.polygon;
var multiPolygon = helpers.multiPolygon;

/**
 * Converts (Multi)LineString(s) to Polygon(s).
 *
 * @name lineStringToPolygon
 * @param {FeatureCollection|Feature<LineString|MultiLineString>} lines Features to convert
 * @param {boolean} [autoComplete=true] auto complete linestrings (matches first & last coordinates)
 * @param {Object} [properties] translates GeoJSON properties to Feature
 * @returns {Feature<Polygon|MultiPolygon>} converted to Polygons
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
module.exports = function (lines, autoComplete, properties) {
    // validation
    if (!lines) throw new Error('lines is required');

    // default params
    autoComplete = (autoComplete !== undefined) ? autoComplete : true;
    var type = geomType(lines);

    switch (type) {
    case 'FeatureCollection':
    case 'GeometryCollection':
        var coords = [];
        var features = (lines.features) ? lines.features : lines.geometries;
        features.forEach(function (line) {
            coords.push(getCoords(lineStringToPolygon(line, autoComplete)));
        });
        return multiPolygon(coords, properties);
    }
    return lineStringToPolygon(lines, autoComplete, properties);
};

/**
 * LineString to Polygon
 *
 * @private
 * @param {Feature<LineString|MultiLineString>} line line
 * @param {boolean} [autoComplete=true] auto complete linestrings
 * @param {Object} [properties] translates GeoJSON properties to Feature
 * @returns {Feature<Polygon>} line converted to Polygon
 */
function lineStringToPolygon(line, autoComplete, properties) {
    properties = properties || line.properties || {};
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

/**
 * Auto Complete Coords - matches first & last coordinates
 *
 * @param {Array<Array<number>>} coords Coordinates
 * @returns {Array<Array<number>>} auto completed coordinates
 */
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
