import { Feature, Polygon } from '@turf/helpers';
import { getCoords } from '@turf/invariant';

/**
 * Takes a polygon and return true or false as to whether it is concave or not.
 *
 * @name booleanConcave
 * @param {Feature<Polygon>} polygon to be evaluated
 * @returns {boolean} true/false
 * @example
 * var convexPolygon = turf.polygon([[[0,0],[0,1],[1,1],[1,0],[0,0]]]);
 *
 * turf.booleanConcave(convexPolygon)
 * //=false
 */
function booleanConcave(polygon: Feature<Polygon> | Polygon) {
    // validation
    if (!polygon) throw new Error('polygon is required');
    var type = (polygon.type === 'Feature') ? polygon.geometry.type : polygon.type;
    if (type !== 'Polygon') throw new Error('geometry must be a Polygon');

    // Taken from https://stackoverflow.com/a/1881201 & https://stackoverflow.com/a/25304159
    var coords = getCoords(polygon);
    if (coords[0].length <= 4) return false;

    var sign = false;
    var n = coords[0].length - 1;
    for (var i = 0; i < n; i++) {
        var dx1 = coords[0][(i + 2) % n][0] - coords[0][(i + 1) % n][0];
        var dy1 = coords[0][(i + 2) % n][1] - coords[0][(i + 1) % n][1];
        var dx2 = coords[0][i][0] - coords[0][(i + 1) % n][0];
        var dy2 = coords[0][i][1] - coords[0][(i + 1) % n][1];
        var zcrossproduct = (dx1 * dy2) - (dy1 * dx2);
        if (i === 0) sign = zcrossproduct > 0;
        else if (sign !== (zcrossproduct > 0)) return true;
    }
    return false;
}

export default booleanConcave;
