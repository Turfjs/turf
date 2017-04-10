var getCoords = require('@turf/invariant').getCoords;
var helpers = require('@turf/helpers');
var lineString = helpers.lineString;
var multiLineString = helpers.multiLineString;
var featureCollection = helpers.featureCollection;

/**
 * Converts a {@link Polygon} or {@link MultiPolygon} to a {@link FeatureCollection} of {@link LineString} or {@link MultiLineString}.
 *
 * @name polygonToLineString
 * @param {Feature<Polygon|MultiPolygon>} polygon Feature to convert
 * @returns {FeatureCollection<LineString|MultiLinestring>} converted Feature to Lines
 * @example
 * var poly = {
 *   'type': 'Feature',
 *   'properties': {},
 *   'geometry': {
 *     'type': 'Polygon',
 *     'coordinates': [[[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]]
 *   }
 * }
 * var lines = turf.polygonToLineString(poly);
 * //addToMap
 * var addToMap = [lines]
 */
module.exports = function (polygon) {
    var geom = getGeomType(polygon);
    var coords = getCoords(polygon);
    var properties = polygon.properties;
    if (!coords.length) throw new Error('polygon must contain coordinates');

    switch (geom) {
    case 'Polygon':
        return featureCollection([coordsToLine(coords, properties)]);
    case 'MultiPolygon':
        var lines = [];
        coords.forEach(function (coord) {
            lines.push(coordsToLine(coord, properties));
        });
        return featureCollection(lines);
    default:
        throw new Error('geom ' + geom + ' not supported');
    }
};

function coordsToLine(coords, properties) {
    if (coords.length > 1) return multiLineString(coords, properties);
    return lineString(coords[0], properties);
}

function getGeomType(feature) {
    return (feature.geometry) ? feature.geometry.type : feature.type;
}
