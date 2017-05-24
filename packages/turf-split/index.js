var chunk = require('lodash.chunk');
var helpers = require('@turf/helpers');
var polyK = require('polyK').Slice;
var fc = helpers.featureCollection;
var polygon = helpers.polygon;

/**
* Takes a {@link Polygon} and cuts it with a {@link Linestring}. Note the linestring must be a straight line (eg made of only two points).
* Properties from the input polygon will be retained on output polygons. Internally uses [polyK](http://polyk.ivank.net/) to perform split.
*
* @name split
* @param {Feature<(Polygon)>} poly - single Polygon Feature
* @param {Feature<(Polyline)>} line - single Polyline Feature
* @return {FeatureCollection<(Polygon)>} A FeatureCollection of polygons
 * @example
 * var polygon = {
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *         [0,0],
 *         [0,10],
 *         [10,10],
 *         [10,0],
 *         [0,0]
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
 *         [5,-15]
 *       ]
 *     }
 *   }
 *
 * var split = turf.split(polygon, linestring);
 *
 * //=split
*/
module.exports = function (poly, line) {

    if (poly.geometry.type !== 'Polygon') {
        return console.warn('@Turf/Split: first argument must be a polygon.');
    }
    if (line.geometry.type !== 'LineString' || line.geometry.coordinates.length > 2) {
        return console.warn('@Turf/Split: second argument must be a linesting with only 2 vertices.');
    }

    poly.geometry.coordinates[0].pop();
    var polyCoordsFlattened = [].concat.apply([], poly.geometry.coordinates[0]);

    var out = polyK(polyCoordsFlattened, line.geometry.coordinates[0][0], line.geometry.coordinates[0][1], line.geometry.coordinates[1][0], line.geometry.coordinates[1][1]);
    var outfeatures = [];
    out.forEach(function (item) {
        var coords = chunk(item, 2);
        coords.push(coords[0]);
        outfeatures.push(polygon([coords], poly.properties));
    });
    return fc(outfeatures);
};
