var getCoords = require('@turf/invariant').getCoords;
var helpers = require('@turf/helpers');
var lineString = helpers.lineString;
var multiLineString = helpers.multiLineString;
var featureCollection = helpers.featureCollection;

/**
 * Converts a {@link Polygon} to {@link LineString|(Multi)LineString} or {@link MultiPolygon} to a {@link FeatureCollection} of {@link LineString|(Multi)LineString}.
 *
 * @name polygonToLineString
 * @param {Feature<Polygon|MultiPolygon>} polygon Feature to convert
 * @param {Object} [properties] translates GeoJSON properties to Feature
 * @returns {FeatureCollection|Feature<LineString|MultiLinestring>} converted (Multi)Polygon to (Multi)LineString
 * @example
 * var poly = turf.polygon([[[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]]);
 *
 * var line = turf.polygonToLineString(poly);
 *
 * //addToMap
 * var addToMap = [line];
 */
module.exports = function (polygon, properties) {
    var geom = getGeomType(polygon);
    var coords = getCoords(polygon);
    properties = properties || polygon.properties || {};

    if (!coords.length) throw new Error('polygon must contain coordinates');

    switch (geom) {
    case 'Polygon':
        return coordsToLine(coords, properties);
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
