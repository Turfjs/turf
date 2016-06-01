// http://stackoverflow.com/questions/839899/how-do-i-calculate-a-point-on-a-circles-circumference
// radians = degrees * (pi/180)
// https://github.com/bjornharrtell/jsts/blob/master/examples/buffer.html

var helpers = require('turf-helpers');
var featureCollection = helpers.featureCollection;
var jsts = require('jsts');
var normalize = require('geojson-normalize');

/**
 * Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.
 *
 * @name buffer
 * @param {(Feature|FeatureCollection)} feature input to be buffered
 * @param {number} distance distance to draw the buffer
 * @param {string} unit any of the options supported by turf units
 * @return {FeatureCollection<Polygon>|FeatureCollection<MultiPolygon>|Polygon|MultiPolygon} buffered features
 *
 * @example
 * var pt = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-90.548630, 14.616599]
 *   }
 * };
 * var unit = 'miles';
 *
 * var buffered = turf.buffer(pt, 500, unit);
 * var result = turf.featurecollection([buffered, pt]);
 *
 * //=result
 */

module.exports = function (feature, radius, units) {

    var degrees = helpers.distanceToDegrees(radius, units);
    var fc = normalize(feature);
    var buffered = normalize(featureCollection(fc.features.map(function (f) {
        return bufferOp(f, degrees);
    })));

    if (buffered.features.length > 1) return buffered;
    else if (buffered.features.length === 1) return buffered.features[0];
};

function bufferOp(feature, radius) {
    var reader = new jsts.io.GeoJSONReader();
    var geom = reader.read(feature.geometry);
    var buffered = geom.buffer(radius);
    var writer = new jsts.io.GeoJSONWriter();
    buffered = writer.write(buffered);

    return {
        type: 'Feature',
        geometry: buffered,
        properties: {}
    };
}
