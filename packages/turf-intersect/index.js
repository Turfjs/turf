// depend on jsts for now http://bjornharrtell.github.io/jsts/
var jsts = require('jsts');

/**
 * Takes two {@link Feature|feature} and finds their intersection. If they share a border, returns the border; if they don't intersect, returns undefined.
 *
 * @name intersect
 * @param {Feature} feature1 the first feature
 * @param {Feature} feature2 the second feature
 * @return {(Feature|undefined)} returns a feature representing the point(s) they share (in case of a {@link Point}  or {@link MultiPoint}), the borders they share (in case of a {@link LineString} or a {@link MultiLineString}), the area they share (in case of {@link Polygon} or {@link MultiPolygon}). If they do not share any point, returns `undefined`.
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
 * //=intersection
 */
module.exports = function intersect(feature1, feature2) {
    var geom1, geom2;
    if (feature1.type === 'Feature') geom1 = feature1.geometry;
    else geom1 = feature1;
    if (feature2.type === 'Feature') geom2 = feature2.geometry;
    else geom2 = feature2;
    var reader = new jsts.io.GeoJSONReader();
    var a = reader.read(JSON.stringify(geom1));
    var b = reader.read(JSON.stringify(geom2));
    var intersection = a.intersection(b);

    if (intersection.isEmpty()) {
        return undefined;
    }

    var writer = new jsts.io.GeoJSONWriter();

    var geojsonGeometry = writer.write(intersection);
    return {
        type: 'Feature',
        properties: {},
        geometry: geojsonGeometry
    };
};
