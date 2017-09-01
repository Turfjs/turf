var meta = require('@turf/meta');
var getCoords = require('@turf/invariant').getCoords;
var booleanClockwise = require('@turf/boolean-clockwise');
var featureCollection = require('@turf/helpers').featureCollection;
var geomEach = meta.geomEach;
var featureEach = meta.featureEach;

/**
 * Rewind {@link LineString|(Multi)LineString} or {@link Polygon|(Multi)Polygon} outer ring counterclockwise and inner rings clockwise (Uses {@link http://en.wikipedia.org/wiki/Shoelace_formula|Shoelace Formula}).
 *
 * @name rewind
 * @param {FeatureCollection|Geometry|Feature<Polygon|MultiPolygon|LineString|MultiLineString>} geojson input GeoJSON Polygon
 * @param {Boolean} [reverse=false] enable reverse winding
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {FeatureCollection|Geometry|Feature<Polygon|MultiPolygon|LineString|MultiLineString>} rewind Polygon
 * @example
 * var polygon = turf.polygon([[[121, -29], [138, -29], [138, -18], [121, -18], [121, -29]]]);
 *
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

    // Support Feature Collection or Geometry Collection
    var results = [];
    switch (geojson.type) {
    case 'GeometryCollection':
        geomEach(geojson, function (geometry) {
            rewind(geometry, reverse);
        });
        return geojson;
    case 'FeatureCollection':
        featureEach(geojson, function (feature) {
            featureEach(rewind(feature, reverse), function (result) {
                results.push(result);
            });
        });
        return featureCollection(results);
    }
    // Support Feature or Geometry Objects
    return rewind(geojson, reverse);
};

/**
 * Rewind
 *
 * @private
 * @param {Geometry|Feature<any>} geojson Geometry or Feature
 * @param {Boolean} [reverse=false] enable reverse winding
 * @returns {Geometry|Feature<any>} rewind Geometry or Feature
 */
function rewind(geojson, reverse) {
    var type = (geojson.type === 'Feature') ? geojson.geometry.type : geojson.type;

    // Support all GeoJSON Geometry Objects
    switch (type) {
    case 'GeometryCollection':
        geomEach(geojson, function (geometry) {
            rewind(geometry, reverse);
        });
        return geojson;
    case 'LineString':
        rewindLineString(getCoords(geojson), reverse);
        return geojson;
    case 'Polygon':
        rewindPolygon(getCoords(geojson), reverse);
        return geojson;
    case 'MultiLineString':
        getCoords(geojson).forEach(function (lineCoords) {
            rewindLineString(lineCoords, reverse);
        });
        return geojson;
    case 'MultiPolygon':
        getCoords(geojson).forEach(function (lineCoords) {
            rewindPolygon(lineCoords, reverse);
        });
        return geojson;
    case 'Point':
    case 'MultiPoint':
        return geojson;
    }
}

/**
 * Rewind LineString - outer ring clockwise
 *
 * @private
 * @param {Array<Array<number>>} coords GeoJSON LineString geometry coordinates
 * @param {Boolean} [reverse=false] enable reverse winding
 * @returns {void} mutates coordinates
 */
function rewindLineString(coords, reverse) {
    if (booleanClockwise(coords) === reverse) coords.reverse();
}

/**
 * Rewind Polygon - outer ring counterclockwise and inner rings clockwise.
 *
 * @private
 * @param {Array<Array<Array<number>>>} coords GeoJSON Polygon geometry coordinates
 * @param {Boolean} [reverse=false] enable reverse winding
 * @returns {void} mutates coordinates
 */
function rewindPolygon(coords, reverse) {
    // outer ring
    if (booleanClockwise(coords[0]) !== reverse) {
        coords[0].reverse();
    }
    // inner rings
    for (var i = 1; i < coords.length; i++) {
        if (booleanClockwise(coords[i]) === reverse) {
            coords[i].reverse();
        }
    }
}
