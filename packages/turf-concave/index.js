// 1. run tin on points
// 2. calculate lenth of all edges and area of all triangles
// 3. remove triangles that fail the max length test
// 4. buffer the results slightly
// 5. merge the results
var concaveman = require('concaveman');
var coordAll = require('turf-meta').coordAll;

/**
 * Takes a set of {@link Point|points} and returns a concave hull polygon.
 *
 * Internally, this uses [turf-tin](https://github.com/Turfjs/turf-tin) to generate geometries.
 *
 * @module turf/concave
 * @category transformation
 * @param {FeatureCollection<Point>} points input points
 * @param {Number} maxEdge the size of an edge necessary for part of the
 * hull to become concave (in miles)
 * @param {String} units used for maxEdge distance (miles or kilometers)
 * @returns {Feature<Polygon>} a concave hull
 * @throws {Error} if maxEdge parameter is missing
 * @throws {Error} if units parameter is missing
 * @example
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.601226, 44.642643]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.591442, 44.651436]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.580799, 44.648749]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.573589, 44.641788]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.587665, 44.64533]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.595218, 44.64765]
 *       }
 *     }
 *   ]
 * };
 *
 * var hull = turf.concave(points, 1, 'miles');
 *
 * var resultFeatures = points.features.concat(hull);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */

module.exports = function (layer, maxEdge, units) {
    if (typeof maxEdge !== 'number') throw new Error('maxEdge parameter is required');
    if (typeof units !== 'string') throw new Error('units parameter is required');

    var hull = concaveman(coordAll(layer));

    return {
        type: 'Polygon',
        coordinates: [hull]
    };
};
