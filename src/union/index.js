import * as polyClipping from 'polygon-clipping';
import { multiPolygon } from '../helpers';
import { geomEach } from '../meta';

/**
 * Takes two or more {@link Polygon|polygons} and returns a combined polygon. If the input polygons are not contiguous, this function returns a {@link MultiPolygon} feature.
 *
 * @name union
 * @param {Feature<Polygon|MultiPolygon>} fc a FeatureCollection containting polygons or multipolygons to union
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
function union(fc) {

    const args = [];
    geomEach(fc, function (geom) {
        if (geom.type === 'Polygon') args.push(geom.coordinates);
        else geom.coordinates.forEach(function (contour) {
            args.push(contour);
        });
    });
    var unioned = polyClipping.union(args);
    if (unioned.length === 0) return null;
    else return multiPolygon(unioned);
}

export default union;
