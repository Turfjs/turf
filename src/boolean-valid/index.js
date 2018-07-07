import { segmentEach } from '../meta';
import { getGeom, getCoords, getType } from '../invariant';
import { polygon, lineString } from '../helpers';
import booleanDisjoint from '../boolean-disjoint';
import booleanCrosses from '../boolean-crosses';
import lineIntersect from '../line-intersect';
import isPointOnLine from '../boolean-point-on-line';

/**
 * booleanValid checks if the geometry is a valid according to the OGC Simple Feature Specification.
 *
 * @name booleanValid
 * @param {Geometry|Feature<any>} feature GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 *
 * turf.booleanValid(line); // => true
 * turf.booleanValid({foo: "bar"}); // => false
 */
export default function booleanValid(feature) {
    // Automatic False
    if (!feature.type) return false;

    // Parse GeoJSON
    const geom = getGeom(feature);
    const type = geom.type;
    const coords = geom.coordinates;

    switch (type) {
    case 'Point':
        return coords.length > 1;
    case 'MultiPoint':
        for (var i = 0; i < coords.length; i++) {
            if (coords[i].length < 2) return false;
        }
        return true;
    case 'LineString':
        if (coords.length < 2) return false
        for (var i = 0; i < coords.length; i++) {
            if (coords[i].length < 2) return false;
        }
        return true;
    case 'MultiLineString':
        if (coords.length < 2) return false
        for (var i = 0; i < coords.length; i++) {
            if (coords[i].length < 2) return false;
        }
        return true;
    case 'Polygon':
        for (var i = 0; i < geom.coordinates.length; i++) {
            if (coords[i].length < 4) return false
            if (!checkRingsClose(coords[i])) return false
            if (checkRingsForSpikesPunctures(coords[i])) return false
            if (i > 0) {
                if (lineIntersect(polygon([coords[0]]), polygon([coords[i]])).features.length > 1) return false
            }
        }
        return true
    case 'MultiPolygon':
        for (var i = 0; i < geom.coordinates.length; i++) {
            var poly = geom.coordinates[i];

            for (var ii = 0; ii < poly.length; ii++) {
                if (poly[ii].length < 4) return false
                if (!checkRingsClose(poly[ii])) return false
                if (checkRingsForSpikesPunctures(poly[ii])) return false
                if (ii === 0) {
                    if (!checkPolygonAgainstOthers(poly, geom.coordinates, i)) return false
                }
                if (ii > 0) {
                    if (lineIntersect(polygon([poly[0]]), polygon([poly[ii]])).features.length > 1) return false
                }
            }
        }
        return true
    default: return false;
    }
}

function checkRingsClose(geom) {
   return geom[0][0] === geom[geom.length - 1][0] || geom[0][1] === geom[geom.length - 1][1]
}

function checkRingsForSpikesPunctures(geom) {
    for (var i = 0; i < geom.length - 1; i++) {
        var point = geom[i]
        for (var ii = i + 1; ii < geom.length - 2; ii++) {
            var seg = [geom[ii], geom[ii + 1]]
            if (isPointOnLine(point, lineString(seg))) return true
        }
    }
    return false
}

function checkPolygonAgainstOthers(poly, geom, index) {
    var polyToCheck = polygon(poly)
    for (var i = index + 1; i < geom.length; i++) {
        if (!booleanDisjoint(polyToCheck, polygon(geom[i]))) {
            if (booleanCrosses(polyToCheck, lineString(geom[i][0]))) return false
        }
    }
    return true
}