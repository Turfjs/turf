// var geojsonFlatten = require('geojson-flatten');
var helpers = require('@turf/helpers');
var featureEach = require('@turf/meta').featureEach;
var geomEach = require('@turf/meta').geomEach;

/**
 * Flattens any {@link GeoJSON} to a {@link FeatureCollection} inspired by [geojson-flatten](https://github.com/tmcw/geojson-flatten).
 *
 * @name flatten
 * @param {Feature} geojson any valid {@link GeoJSON} with multi-geometry {@link Feature}s
 * @param {*} [properties={}] translate properties to each {@link Feature} (only applies for {@link GeometryCollection} & {@link GeometryObject})
 * @return {FeatureCollection} a flattened {@link FeatureCollection}
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
function flatten(geojson, properties) {
    // Convert Geometry Object to Feature
    switch (geojson.type) {
    case 'FeatureCollection':
    case 'Feature':
    case 'GeometryCollection':
        break;
    default:
        geojson = {
            type: 'Feature',
            properties: properties || {},
            geometry: geojson
        };
    }

    // Convert to Flattened FeatureCollection
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
        return flattenGeometryCollection(geojson, properties);
    case 'Point':
    case 'LineString':
    case 'Polygon':
        return helpers.featureCollection([geojson]);
    }
    // // Fallback to geojson-flatten original source code
    // var flattened = geojsonFlatten(geojson);
    // if (flattened.type === 'FeatureCollection') return flattened;
    // else return helpers.featureCollection(geojsonFlatten(geojson));
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
    geojson.geometry.coordinates.forEach(function (coordinates) {
        var point = {
            type: 'Feature',
            properties: geojson.properties,
            geometry: {
                type: 'Point',
                coordinates: coordinates
            }
        };
        points.push(point);
    });
    return helpers.featureCollection(points);
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
    geojson.geometry.coordinates.forEach(function (coordinates) {
        lines.push(helpers.lineString(coordinates, geojson.properties));
    });
    return helpers.featureCollection(lines);
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
    geojson.geometry.coordinates.forEach(function (coordinates) {
        polygons.push(helpers.polygon(coordinates, geojson.properties));
    });
    return helpers.featureCollection(polygons);
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
    featureEach(geojson, function (feature) {
        switch (feature.type) {
        case 'MultiPoint':
        case 'MultiLineString':
        case 'MultiPolygon':
            var flattened = flatten(feature);
            featureEach(flattened, function (multiFeature) {
                features.push(multiFeature);
            });
            break;
        default:
            features.push(feature);
        }
    });
    return helpers.featureCollection(features);
}

/**
 * Flatten GeometryCollection
 *
 * @private
 * @param {GeometryCollection<any>} geojson GeoJSON Geometry Collection
 * @param {*} [properties] translate properties to Feature
 * @returns {FeatureCollection<any>} Feature Collection
 */
function flattenGeometryCollection(geojson, properties) {
    var features = [];
    geomEach(geojson, function (geometry) {
        switch (geometry.type) {
        case 'MultiPoint':
        case 'MultiLineString':
        case 'MultiPolygon':
            var flattened = flatten(geometry, properties);
            featureEach(flattened, function (feature) {
                features.push(feature);
            });
            break;
        default:
            var feature = {
                type: 'Feature',
                properties: properties || {},
                geometry: geometry
            };
            features.push(feature);
        }
    });
    return helpers.featureCollection(features);
}
