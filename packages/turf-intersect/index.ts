import * as martinez from 'martinez-polygon-clipping';
import { getGeom } from '@turf/invariant';
import { multiPolygon, polygon, Feature, Polygon, MultiPolygon, Properties } from '@turf/helpers';

/**
 * Takes two {@link Polygon|polygons} and finds their intersection. If they share a border, returns the border; if they don't intersect, returns undefined.
 *
 * @name intersect
 * @param {Feature<Polygon>} poly1 the first polygon
 * @param {Feature<Polygon>} poly2 the second polygon
 * @param {Object} [options={}] Optional Parameters
 * @param {Object} [options.properties={}] Translate GeoJSON Properties to Feature
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
function intersect<P = Properties>(
    poly1: Feature<Polygon> | Polygon,
    poly2: Feature<Polygon> | Polygon,
    options: {
        properties?: P,
    } = {}
): Feature<Polygon | MultiPolygon, P> | null {
    const geom1 = getGeom(poly1);
    const geom2 = getGeom(poly2);

    if (geom1.type !== 'Polygon') throw new Error('poly1 must be a Polygon');
    if (geom2.type !== 'Polygon') throw new Error('poly2 must be a Polygon');

    const intersection: any = martinez.intersection(geom1.coordinates, geom2.coordinates);

    if (intersection === null || intersection.length === 0) return null;
    if (intersection.length === 1) {
        const start = intersection[0][0][0];
        const end = intersection[0][0][intersection[0][0].length - 1];
        if (start[0] === end[0] && start[1] === end[1]) return polygon(intersection[0], options.properties);
        return null;
    }
    return multiPolygon(intersection, options.properties);
}

export default intersect;
