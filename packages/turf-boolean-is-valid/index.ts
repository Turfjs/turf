import { segmentEach } from '@turf/helpers';
import { getGeom, getCoords, getType } from '@turf/invariant';
import { polygon, lineString } from '@turf/helpers';
import booleanDisjoint from '@turf/boolean-disjoint';
import booleanCrosses from '@turf/boolean-crosses';
import lineIntersect from '@turf/line-intersect';
import isPointOnLine from '@turf/boolean-point-on-line';

/**
 * booleanIsValid checks if the geometry is a valid according to the OGC Simple Feature Specification.
 *
 * @name booleanIsValid
 * @param {Geometry|Feature<any>} feature GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 *
 * turf.booleanIsValid(line, point);
 * //=true
 */
export default function booleanIsValid(feature: Feature<any> | Geometry) {
    const geom = getGeom(feature);
    const type = getType(feature);
    const coords = getCoords(feature);

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
            if (geom.coordinates[i].length < 4) return false
            if (!checkRingsClose(geom.coordinates[i])) return false
            if (checkRingsForSpikesPunctures(geom.coordinates[i])) return false
            if (i > 0) {
                if (lineIntersect(polygon([geom.coordinates[0]]), polygon([geom.coordinates[i]])).features.length > 1) return false
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