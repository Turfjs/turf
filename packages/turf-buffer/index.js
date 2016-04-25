// http://stackoverflow.com/questions/839899/how-do-i-calculate-a-point-on-a-circles-circumference
// radians = degrees * (pi/180)
// https://github.com/bjornharrtell/jsts/blob/master/examples/buffer.html

var featurecollection = require('turf-helpers').featureCollection;
var jsts = require('jsts');
var normalize = require('geojson-normalize');

/**
* Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.
*
* @name buffer
* @category transformation
* @param {(Feature|FeatureCollection)} feature input to be buffered
* @param {Number} distance distance to draw the buffer
* @param {String} unit 'miles', 'feet', 'kilometers', 'meters', or 'degrees'
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

    switch (units) {
    case 'miles':
        radius = radius / 69.047;
        break;
    case 'feet':
        radius = radius / 364568.0;
        break;
    case 'kilometers':
        radius = radius / 111.12;
        break;
    case 'meters':
    case 'metres':
        radius = radius / 111120.0;
        break;
    case 'degrees':
        break;
    }

    var fc = normalize(feature);
    var buffered = normalize(featurecollection(fc.features.map(function (f) {
        return bufferOp(f, radius);
    })));

    if (buffered.features.length > 1) return buffered;
    else if (buffered.features.length === 1) return buffered.features[0];
};

function bufferOp(feature, radius) {
    var reader = new jsts.io.GeoJSONReader();
    var geom = reader.read(JSON.stringify(feature.geometry));
    var buffered = geom.buffer(radius);
    var parser = new jsts.io.GeoJSONParser();
    buffered = parser.write(buffered);

    return {
        type: 'Feature',
        geometry: buffered,
        properties: {}
    };
}
