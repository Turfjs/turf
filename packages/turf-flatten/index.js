var flatten = require('geojson-flatten');
var featurecollection = require('@turf/helpers').featureCollection;

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
    var flattened = flatten(geojson);
    if (flattened.type === 'FeatureCollection') return flattened;
    else return featurecollection(flatten(geojson));
};
