var getCoords = require('@turf/invariant').getCoords;

/**
 * Rewind {@link LineString|(Mutli)LineString} or {@link Polygon|(Multi)Polygon} outer ring clockwise and inner rings counterclockwise (Uses {@link http://en.wikipedia.org/wiki/Shoelace_formula|Shoelace Formula}).
 *
 * @name rewind
 * @param {Feature<Polygon|MultiPolygon|LineString|MultiLineString>} geojson input GeoJSON Polygon
 * @param {Boolean} [reverse=false] enable reverse winding
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {Feature<Polygon|MultiPolygon|LineString|MultiLineString>} rewind Polygon
 * @example
 * var polygon = {
 *     "type": "Feature",
 *     "properties": {},
 *     "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [
 *             [[121, -29], [138, -29], [138, -18], [121, -18], [121, -29]]
 *         ]
 *     }
 * };
 * var rewind = turf.rewind(polygon);
 *
 * //addToMap
 * var addToMap = [rewind];
 */
module.exports = function (geojson, reverse, mutate) {
    // default params
    reverse = (reverse !== undefined) ? reverse : false;
    mutate = (mutate !== undefined) ? mutate : false;

    // validation
    if (!geojson) throw new Error('<geojson> is required');
    if (typeof reverse !== 'boolean') throw new Error('<reverse> must be a boolean');
    if (typeof mutate !== 'boolean') throw new Error('<mutate> must be a boolean');

    // prevent input mutation
    if (mutate === false || mutate === undefined) geojson = JSON.parse(JSON.stringify(geojson));

    var coords = getCoords(geojson);
    var type = getGeomType(geojson);

    switch (type) {
    case 'LineString':
        rewindLineString(coords, reverse);
        return geojson;
    case 'Polygon':
        rewindPolygon(coords, reverse);
        return geojson;
    case 'MultiLineString':
        coords.forEach(function (lineCoords) {
            rewindLineString(lineCoords, reverse);
        });
        return geojson;
    case 'MultiPolygon':
        coords.forEach(function (lineCoords) {
            rewindPolygon(lineCoords, reverse);
        });
        return geojson;
    default:
        throw new Error('geometry ' + type + ' type not supported');
    }
};

/**
 * Rewind LineString - outer ring clockwise
 *
 * @param {Array<Array<number>>} coords GeoJSON LineString geometry coordinates
 * @param {Boolean} [reverse=false] enable reverse winding
 * @returns {void} mutates coordinates
 */
function rewindLineString(coords, reverse) {
    if (isClockWise(coords) === reverse) coords.reverse();
}

/**
 * Rewind Polygon - outer ring clockwise and inner rings counterclockwise.
 *
 * @param {Array<Array<Array<number>>>} coords GeoJSON Polygon geometry coordinates
 * @param {Boolean} [reverse=false] enable reverse winding
 * @returns {void} mutates coordinates
 */
function rewindPolygon(coords, reverse) {
    // outer ring
    if (isClockWise(coords[0]) === reverse) {
        coords[0].reverse();
    }
    // inner rings
    for (var i = 1; i < coords.length; i++) {
        if (isClockWise(coords[i]) !== reverse) {
            coords[i].reverse();
        }
    }
}

/**
 * is Clockwise
 *
 * @private
 * @param {Array<Array<number>>} coords LineString geometry coordinates
 * @returns {boolean} is LineString clockwise or not
 */
function isClockWise(coords) {
    var initialValue = 0;
    var reduced = coords.reduce(function (previous, current, index) {
        var a = previous;
        var b = current;
        var c = index;
        var d = coords;
        return a + ((c < d.length - 1) ? (d[c + 1][0] - b[0]) * (d[c + 1][1] + b[1]) : 0);
    }, initialValue);
    return reduced > 0;
}

function getGeomType(feature) {
    return (feature.geometry) ? feature.geometry.type : feature.type;
}
