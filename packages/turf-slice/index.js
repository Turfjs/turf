var slice = require('polyk').Slice;
var helpers = require('@turf/helpers');

/**
 * Takes a {@link Polygon} and cuts it with a {@link Linestring}. Note the linestring must be a straight line (eg made of only two points).
 * Properties from the input polygon will be retained on output polygons. Internally uses [polyK](http://polyk.ivank.net/) to perform slice.
 *
 * @name slice
 * @param {Feature<Polygon>} polygon single Polygon Feature
 * @param {Feature<LineString>} linestring single LineString Feature
 * @returns {FeatureCollection<Polygon>} FeatureCollection of Polygons
 * @example
 * var polygon = {
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *         [0, 0],
 *         [0, 10],
 *         [10, 10],
 *         [10, 0],
 *         [0, 0]
 *     ]]
 *   }
 * };
 *
 * var linestring =  {
 *     "type": "Feature",
 *     "properties": {},
 *     "geometry": {
 *       "type": "LineString",
 *       "coordinates": [
 *         [5, 15],
 *         [5, -15]
 *       ]
 *     }
 *   }
 *
 * var sliced = turf.slice(polygon, linestring);
 *
 * //=sliced
*/
module.exports = function (polygon, linestring) {
    if (polygon.geometry.type !== 'Polygon') {
        return console.warn('@turf/slice: first argument must be a polygon.');
    }
    if (linestring.geometry.type !== 'LineString' || linestring.geometry.coordinates.length > 2) {
        return console.warn('@turf/slice: second argument must be a linesting with only 2 vertices.');
    }
    var start = linestring.geometry.coordinates[0];
    var end = linestring.geometry.coordinates[linestring.geometry.coordinates.length - 1];
    var sliced = slice(convertToArray(polygon), start[0], start[1], end[0], end[1]);

    return convertToGeoJSON(sliced);
};

/**
 * Convert GeoJSON Polygon to Polygon
 *
 * @private
 * @param {Feature<Polygon>} polygon GeoJSON Feature Polygon
 * @returns {number[]} Array Polygon
 */
function convertToArray(polygon) {
    return [].concat.apply([], polygon.geometry.coordinates[0]);
}

/**
 * Convert Array Polygon to FeatureCollection GeoJSON Polygon
 *
 * @private
 * @param {number[]} array Array of coordinates [x1, y1, x2, y2...]
 * @returns {FeatureCollection<Polygon>} GeoJSON FeatureCollection Polygon
 */
function convertToGeoJSON(array) {
    const geojson = helpers.featureCollection([]);
    array.forEach((item) => {
        var coords = chunk(item, 2);
        coords.push(coords[0]);
        geojson.features.push(helpers.polygon([coords]));
    });
    return geojson;
}

/**
 * Chunk
 *
 * @private
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size) {
    var length = (array && array.length) ? array.length : 0;
    var result = [];
    var index = 0;
    var currentIndex = 0;
    while (index < length) {
        result[currentIndex++] = array.slice(index, (index += size));
    }
    return result;
}
