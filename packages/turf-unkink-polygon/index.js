/**
 * Takes a kinked polygon and returns a feature collection of polygons that have no kinks.
 * Uses [simplepolygon](https://github.com/mclaeysb/simplepolygon) internally.
 *
 * @name unkinkPolygon
 * @param {Feature<Polygon>} Input polygon
 * @returns {FeatureCollection<Polygon>} Unkinked polygons
 * @example
 * var poly = {
 *    'type': 'Feature',
 *      'geometry': {
 *         'type': 'Polygon',
 *        'coordinates': [[[0, 0], [2, 0], [0, 2], [2, 2], [0, 0]]]
 *       }
 * };
 *
 * var result = turf.unkinkPolygon(poly);
 *
 * //=result
 */

var simplepolygon = require('simplepolygon');

module.exports = function (polygon) {
    var outPolys = simplepolygon(polygon);
    outPolys.features.forEach(function (item) {
        if (polygon.properties) {
            item.properties = polygon.properties;
        } else {
            item.properties = {};
        }
    });
    return outPolys;
};
