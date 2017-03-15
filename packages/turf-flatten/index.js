var featureEach = require('@turf/meta').featureEach;
var geomEach = require('@turf/meta').geomEach;
var getCoords = require('@turf/invariant').getCoords;
var helpers = require('@turf/helpers');
var point = helpers.point;
var lineString = helpers.lineString;
var polygon = helpers.polygon;
var featureCollection = helpers.featureCollection;

/**
 * Flattens any {@link GeoJSON} to a {@link FeatureCollection} inspired by [geojson-flatten](https://github.com/tmcw/geojson-flatten).
 *
 * @name flatten
 * @param {Feature} geojson any valid {@link GeoJSON} with multi-geometry {@link Feature}s
 * @returns {FeatureCollection} a flattened {@link FeatureCollection}
 * @example
 * var geometry = {
 *   "type": "MultiPolygon",
 *   "coordinates": [
 *     [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
 *      [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
 *      [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
 *    ]
 *  };
 *
 * var flattened = turf.flatten(geometry);
 *
 * //=flattened
 */
function flatten(geojson) {
    var type = (geojson.geometry) ? geojson.geometry.type : geojson.type;
    switch (type) {
    case 'MultiPoint':
        return flattenMultiPoint(geojson);
    case 'MultiPolygon':
        return flattenMultiPolygon(geojson);
    case 'MultiLineString':
        return flattenMultiLineString(geojson);
    case 'FeatureCollection':
        return flattenFeatureCollection(geojson);
    case 'GeometryCollection':
        return flattenGeometryCollection(geojson);
    case 'Point':
    case 'LineString':
    case 'Polygon':
        return featureCollection([geojson]);
    }
}
module.exports = flatten;

/**
 * Flatten MultiPoint
 *
 * @private
 * @param {Feature<MultiPoint>} geojson GeoJSON Feature
 * @returns {FeatureCollection<Point>} Feature Collection
 */
function flattenMultiPoint(geojson) {
    var points = [];
    getCoords(geojson).forEach(function (coords) {
        points.push(point(coords, geojson.properties));
    });
    return featureCollection(points);
}

/**
 * Flatten MultiLineString
 *
 * @private
 * @param {Feature<MultiLineString>} geojson GeoJSON Feature
 * @returns {FeatureCollection<LineString>} Feature Collection
 */
function flattenMultiLineString(geojson) {
    var lines = [];
    getCoords(geojson).forEach(function (coords) {
        lines.push(lineString(coords, geojson.properties));
    });
    return featureCollection(lines);
}

/**
 * Flatten MultiPolygon
 *
 * @private
 * @param {Feature<MultiPolygon>} geojson GeoJSON Feature
 * @returns {FeatureCollection<Polygon>} Feature Collection
 */
function flattenMultiPolygon(geojson) {
    var polygons = [];
    getCoords(geojson).forEach(function (coords) {
        polygons.push(polygon(coords, geojson.properties));
    });
    return featureCollection(polygons);
}

/**
 * Flatten FeatureCollection
 *
 * @private
 * @param {FeatureCollection<any>} geojson GeoJSON Feature
 * @returns {FeatureCollection<any>} Feature Collection
 */
function flattenFeatureCollection(geojson) {
    var features = [];
    featureEach(geojson, function (multiFeature) {
        switch (multiFeature.geometry.type) {
        case 'MultiPoint':
        case 'MultiLineString':
        case 'MultiPolygon':
            featureEach(flatten(multiFeature), function (feature) {
                features.push(feature);
            });
            break;
        default:
            features.push(multiFeature);
        }
    });
    return featureCollection(features);
}

/**
 * Flatten GeometryCollection
 *
 * @private
 * @param {GeometryCollection<any>} geojson GeoJSON Geometry Collection
 * @param {*} [properties] translate properties to Feature
 * @returns {FeatureCollection<any>} Feature Collection
 */
function flattenGeometryCollection(geojson) {
    var features = [];
    geomEach(geojson, function (geometry) {
        switch (geometry.type) {
        case 'MultiPoint':
        case 'MultiLineString':
        case 'MultiPolygon':
            featureEach(flatten(geometry), function (feature) {
                features.push(feature);
            });
            break;
        default:
            var feature = {
                type: 'Feature',
                properties: {},
                geometry: geometry
            };
            features.push(feature);
        }
    });
    return featureCollection(features);
}
