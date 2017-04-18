var bbox = require('@turf/bbox');
var point = require('@turf/helpers').point;

/**
 * Takes a {@link Feature} or {@link FeatureCollection} and returns the absolute center point of all features.
 *
 * @name center
 * @param {FeatureCollection|Feature<any>} layer input features
 * @returns {Feature<Point>} a Point feature at the absolute center point of all input features
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.522259, 35.4691]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.502754, 35.463455]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.508269, 35.463245]
 *       }
 *     }
 *   ]
 * };
 *
 * var center = turf.center(features);
 *
 * //addToMap
 * center.properties['marker-size'] = 'large';
 * center.properties['marker-color'] = '#000';
 * var addToMap = [features, center]
 */
module.exports = function (layer) {
    var ext = bbox(layer);
    var x = (ext[0] + ext[2]) / 2;
    var y = (ext[1] + ext[3]) / 2;
    return point([x, y]);
};
