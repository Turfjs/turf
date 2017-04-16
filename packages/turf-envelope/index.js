var bbox = require('@turf/bbox');
var bboxPolygon = require('@turf/bbox-polygon');

/**
 * Takes any number of features and returns a rectangular {@link Polygon} that encompasses all vertices.
 *
 * @name envelope
 * @param {FeatureCollection|Feature<any>} geojson input features
 * @return {Feature<Polygon>} a rectangular Polygon feature that encompasses all vertices
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "name": "Location A"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-75.343, 39.984]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "name": "Location B"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-75.833, 39.284]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "name": "Location C"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-75.534, 39.123]
 *       }
 *     }
 *   ]
 * };
 *
 * var enveloped = turf.envelope(features);
 *
 * //addToMap
 * var addToMap = [features, enveloped]
 */

module.exports = function (geojson) {
    return bboxPolygon(bbox(geojson));
};
