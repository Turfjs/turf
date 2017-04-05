var martinez = require('./martinez.min.js')
var feature = require('@turf/helpers').feature
/**
 * Finds the difference between two {@link Polygon|polygons} by clipping the second
 * polygon from the first.
 *
 * @name difference
 * @param {Feature<Polygon>} p1 input Polygon feature
 * @param {Feature<Polygon>} p2 Polygon feature to difference from `p1`
 * @return {Feature<(Polygon|MultiPolygon)>} a Polygon or MultiPolygon feature showing the area of `p1` excluding the area of `p2`
 * @example
 * var poly1 = {
 *   "type": "Feature",
 *   "properties": {
 *     "fill": "#0f0"
 *   },
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
 *   "properties": {
 *     "fill": "#00f"
 *   },
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
 * differenced.properties.fill = '#f00';
 *
 * var polygons = {
 *   "type": "FeatureCollection",
 *   "features": [poly1, poly2]
 * };
 *
 * //=polygons
 *
 * //=differenced
 */

module.exports = function (p1, p2) {
    var poly1 = JSON.parse(JSON.stringify(p1));
    var poly2 = JSON.parse(JSON.stringify(p2));
    if (poly1.type !== 'Feature') {
        poly1 = feature(poly1)
    }
    if (poly2.type !== 'Feature') {
        poly2 = feature(poly2)
    }
    var outCoords = martinez.diff(poly1.geometry.coordinates, poly2.geometry.coordinates)

    if (outCoords.length === 0) {
    	return undefined
    }
    if (outCoords.length > 1) {
    	poly1.geometry.coordinates = [outCoords]
    	poly1.geometry.type = 'MultiPolygon'
    } else {
    	poly1.geometry.coordinates = outCoords
    }
    return poly1
};
