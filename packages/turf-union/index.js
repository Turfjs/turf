import martinez from 'martinez-polygon-clipping';
import { getCoords } from '@turf/invariant';
import { multiPolygon, polygon } from '@turf/helpers';

/**
 * Takes two or more {@link (Multi)Polygon(s)} and returns a combined polygon. If the input polygons are not contiguous, this function returns a {@link MultiPolygon} feature.
 *
 * @name union
 * @param {Feature<Polygon|MultiPolygon>} polygon1 input Polygon feature
 * @param {Feature<Polygon|MultiPolygon>} polygon2 Polygon feature to difference from polygon1
 * @returns {Feature<(Polygon|MultiPolygon)>} a combined {@link Polygon} or {@link MultiPolygon} feature
 * @example
 * var poly1 = turf.polygon([[
 *     [-82.574787, 35.594087],
 *     [-82.574787, 35.615581],
 *     [-82.545261, 35.615581],
 *     [-82.545261, 35.594087],
 *     [-82.574787, 35.594087]
 * ]], {"fill": "#0f0"});
 * var poly2 = turf.polygon([[
 *     [-82.560024, 35.585153],
 *     [-82.560024, 35.602602],
 *     [-82.52964, 35.602602],
 *     [-82.52964, 35.585153],
 *     [-82.560024, 35.585153]
 * ]], {"fill": "#00f"});
 *
 * var union = turf.union(poly1, poly2);
 *
 * //addToMap
 * var addToMap = [poly1, poly2, union];
 */
function union(polygon1, polygon2) {
    // Validation
    if (!polygon1) throw new Error('polygon1 is required');
    if (!polygon2) throw new Error('polygon2 is required');

    var coords1 = getCoords(polygon1);
    var coords2 = getCoords(polygon2);
    var properties = polygon1.properties || {};

    var unioned = martinez.union(coords1, coords2);
    if (unioned.length === 0) return null;
    if (unioned.length === 1) return polygon(unioned[0], properties);
    else return multiPolygon(unioned, properties);
}

export default union;
