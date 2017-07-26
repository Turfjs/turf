var bbox = require('@turf/bbox');
var getCoords = require('@turf/invariant').getCoords;
var helpers = require('@turf/helpers');
var polygon = helpers.polygon;
var multiPolygon = helpers.multiPolygon;
var lineString = helpers.lineString;

/**
 * Converts (Multi)LineString(s) to Polygon(s).
 *
 * @name lineStringToPolygon
 * @param {FeatureCollection|Feature<LineString|MultiLineString>} lines Features to convert
 * @param {Object} [properties] translates GeoJSON properties to Feature
 * @param {boolean} [autoComplete=true] auto complete linestrings (matches first & last coordinates)
 * @param {boolean} [orderCoords=true] sorts linestrings to place outer ring at the first position of the coordinates
 * @returns {Feature<Polygon|MultiPolygon>} converted to Polygons
 * @example
 * var line = turf.lineString([[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]);
 *
 * var polygon = turf.lineStringToPolygon(line);
 *
 * //addToMap
 * var addToMap = [polygon];
 */
module.exports = function (lines, properties, autoComplete, orderCoords) {
    // validation
    if (!lines) throw new Error('lines is required');

    // default params
    autoComplete = (autoComplete !== undefined) ? autoComplete : true;
    orderCoords = (orderCoords !== undefined) ? orderCoords : true;
    var type = geomType(lines);

    switch (type) {
    case 'FeatureCollection':
    case 'GeometryCollection':
        var coords = [];
        var features = (lines.features) ? lines.features : lines.geometries;
        features.forEach(function (line) {
            coords.push(getCoords(lineStringToPolygon(line, {}, autoComplete, orderCoords)));
        });
        return multiPolygon(coords, properties);
    }
    return lineStringToPolygon(lines, properties, autoComplete, orderCoords);
};

/**
 * LineString to Polygon
 *
 * @private
 * @param {Feature<LineString|MultiLineString>} line line
 * @param {Object} [properties] translates GeoJSON properties to Feature
 * @param {boolean} [autoComplete=true] auto complete linestrings
 * @param {boolean} [orderCoords=true] sorts linestrings to place outer ring at the first position of the coordinates
 * @returns {Feature<Polygon>} line converted to Polygon
 */
function lineStringToPolygon(line, properties, autoComplete, orderCoords) {
    properties = properties || line.properties || {};
    var coords = getCoords(line);
    var type = geomType(line);

    if (!coords.length) throw new Error('line must contain coordinates');

    switch (type) {
    case 'LineString':
        if (autoComplete) coords = autoCompleteCoords(coords);
        return polygon([coords], properties);
    case 'MultiLineString':
        var multiCoords = [];
        var largestArea = 0;

        coords.forEach(function (coord) {
            if (autoComplete) coord = autoCompleteCoords(coord);

            // Largest LineString to be placed in the first position of the coordinates array
            if (orderCoords) {
                var area = calculateArea(bbox(lineString(coord)));
                if (area > largestArea) {
                    multiCoords.unshift(coord);
                    largestArea = area;
                } else multiCoords.push(coord);
            } else {
                multiCoords.push(coord);
            }
        });
        return polygon(multiCoords, properties);
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
 * @private
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

/**
 * area - quick approximate area calculation (used to sort)
 *
 * @private
 * @param {[number, number, number, number]} bbox BBox [west, south, east, north]
 * @returns {number} very quick area calculation
 */
function calculateArea(bbox) {
    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];
    return Math.abs(west - east) * Math.abs(south - north);
}
