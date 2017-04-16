var getCoords = require('@turf/invariant').getCoords;
var polygon = require('@turf/helpers').polygon;
var featureCollection = require('@turf/helpers').featureCollection;
var martinez = require('./martinez.min.js');

/**
 * Finds the difference between two {@link Polygon|polygons} by clipping the second
 * polygon from the first.
 *
 * @name difference
 * @param {Feature<Polygon|MultiPolygon>} poly1 input Polygon feature
 * @param {Feature<Polygon|MultiPolygon>} poly2 Polygon feature to difference from `poly1`
 * @return {FeatureCollection<Polygon>} a Collection of Polygons showing the area of `poly1` excluding the area of `poly2`
 * @example
 * var poly1 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-46.738586, -23.596711],
 *       [-46.738586, -23.458207],
 *       [-46.560058, -23.458207],
 *       [-46.560058, -23.596711],
 *       [-46.738586, -23.596711]
 *     ]]
 *   }
 * };
 * var poly2 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-46.650009, -23.631314],
 *       [-46.650009, -23.5237],
 *       [-46.509246, -23.5237],
 *       [-46.509246, -23.631314],
 *       [-46.650009, -23.631314]
 *     ]]
 *   }
 * };
 *
 * var differenced = turf.difference(poly1, poly2);
 *
 * //addToMap
 * var addToMap = [poly1, poly2, differenced]
 * poly1.properties.fill = '#0f0';
 * poly2.properties.fill = '#00f';
 * differenced.properties.fill = '#f00';
 */

module.exports = function (poly1, poly2) {
    var results = [];
    var coords1 = getCoords(poly1);
    var coords2 = getCoords(poly2);
    var outCoords = martinez.diff(coords1, coords2);

    if (outCoords.length === 1) results.push(polygon(outCoords));
    // To-Do (Geometry is not a valid MultiPolygon)
    // https://github.com/w8r/martinez/issues/5
    else if (outCoords.length > 1) results.push(polygon(outCoords));

    return featureCollection(results);
};
