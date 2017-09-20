// depend on jsts for now http://bjornharrtell.github.io/jsts/
var jsts = require('jsts');
var truncate = require('@turf/truncate');
var feature = require('@turf/helpers').feature;

/**
 * Takes two {@link Polygon|polygons} and finds their intersection. If they share a border, returns the border; if they don't intersect, returns undefined.
 *
 * @name intersect
 * @param {Feature<Polygon>} poly1 the first polygon
 * @param {Feature<Polygon>} poly2 the second polygon
 * @returns {Feature|null} returns a feature representing the point(s) they share (in case of a {@link Point}  or {@link MultiPoint}), the borders they share (in case of a {@link LineString} or a {@link MultiLineString}), the area they share (in case of {@link Polygon} or {@link MultiPolygon}). If they do not share any point, returns `null`.
 * @example
 * var poly1 = turf.polygon([[
 *   [-122.801742, 45.48565],
 *   [-122.801742, 45.60491],
 *   [-122.584762, 45.60491],
 *   [-122.584762, 45.48565],
 *   [-122.801742, 45.48565]
 * ]]);
 *
 * var poly2 = turf.polygon([[
 *   [-122.520217, 45.535693],
 *   [-122.64038, 45.553967],
 *   [-122.720031, 45.526554],
 *   [-122.669906, 45.507309],
 *   [-122.723464, 45.446643],
 *   [-122.532577, 45.408574],
 *   [-122.487258, 45.477466],
 *   [-122.520217, 45.535693]
 * ]]);
 *
 * var intersection = turf.intersect(poly1, poly2);
 *
 * //addToMap
 * var addToMap = [poly1, poly2, intersection];
 */
module.exports = function (poly1, poly2) {
    var geom1 = (poly1.type === 'Feature') ? poly1.geometry : poly1;
    var geom2 = (poly2.type === 'Feature') ? poly2.geometry : poly2;

    var reader = new jsts.io.GeoJSONReader();
    var a = reader.read(truncate(geom1));
    var b = reader.read(truncate(geom2));
    var intersection = a.intersection(b);

    // https://github.com/Turfjs/turf/issues/951
    if (intersection.isEmpty()) return null;

    var writer = new jsts.io.GeoJSONWriter();
    var geom = writer.write(intersection);
    return feature(geom);
};
