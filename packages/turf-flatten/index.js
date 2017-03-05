var flatten = require('geojson-flatten');
var helpers = require('@turf/helpers');

/**
 * Flattens any {@link GeoJSON} to a {@link FeatureCollection} using [geojson-flatten](https://github.com/mapbox/geojson-flatten).
 *
 * @name flatten
 * @param {Feature} geojson any valid {@link GeoJSON} with multi-geometry {@link Feature}s
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
module.exports = function (geojson) {
    switch (geojson.type) {
    case 'MultiPolygon':
        return flattenMultiPolygon(geojson);
    case 'MultiLineString':
        return flattenMultiLineString(geojson);
    case 'MultiPoint':
        return flattenMultiPoint(geojson);
    }
    var flattened = flatten(geojson);
    if (flattened.type === 'FeatureCollection') return flattened;
    else return helpers.featureCollection(flatten(geojson));
};

/**
 * Flatten MultiPoint
 *
 * @private
 * @param {Feature<MultiPoint>} geojson GeoJSON Feature
 * @returns {FeatureCollection<Point>} Feature Collection
 */
function flattenMultiPoint(geojson) {
    var points = [];
    geojson.coordinates.forEach(function (coordinates) {
        points.push(helpers.point(coordinates));
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
    geojson.coordinates.forEach(function (coordinates) {
        lines.push(helpers.lineString(coordinates));
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
    geojson.coordinates.forEach(function (coordinates) {
        polygons.push(helpers.polygon(coordinates));
    });
    return helpers.featureCollection(polygons);
}
