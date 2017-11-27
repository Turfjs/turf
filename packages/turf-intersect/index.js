// depend on jsts for now http://bjornharrtell.github.io/jsts/
import { GeoJSONReader, GeoJSONWriter, OverlayOp } from 'turf-jsts';
import truncate from '@turf/truncate';
import { getGeom } from '@turf/invariant';
import { feature } from '@turf/helpers';
import cleanCoords from '@turf/clean-coords';

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
function intersect(poly1, poly2) {
    var geom1 = getGeom(poly1);
    var geom2 = getGeom(poly2);

    // Return null if geometry is too narrow in coordinate precision
    // fixes topology errors with JSTS
    // https://github.com/Turfjs/turf/issues/463
    // https://github.com/Turfjs/turf/pull/1004
    if (cleanCoords(truncate(geom2, {precision: 4})).coordinates[0].length < 4) return null;
    if (cleanCoords(truncate(geom1, {precision: 4})).coordinates[0].length < 4) return null;

    var reader = new GeoJSONReader();
    var a = reader.read(truncate(geom1));
    var b = reader.read(truncate(geom2));
    var intersection = OverlayOp.intersection(a, b);

    // https://github.com/Turfjs/turf/issues/951
    if (intersection.isEmpty()) return null;

    var writer = new GeoJSONWriter();
    var geom = writer.write(intersection);
    return feature(geom);
}

export default intersect;
