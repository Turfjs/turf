import cleanCoords from '../clean-coords';
import { getGeom } from '../invariant';
import { lineString } from '../helpers';

/**
 * Determine whether two geometries of the same type have identical X,Y coordinate values.
 * See http://edndoc.esri.com/arcsde/9.0/general_topics/understand_spatial_relations.htm
 *
 * @name booleanEqual
 * @param {Geometry|Feature} feature1 GeoJSON input
 * @param {Geometry|Feature} feature2 GeoJSON input
 * @returns {boolean} true if the objects are equal, false otherwise
 * @example
 * var pt1 = turf.point([0, 0]);
 * var pt2 = turf.point([0, 0]);
 * var pt3 = turf.point([1, 1]);
 *
 * turf.booleanEqual(pt1, pt2);
 * //= true
 * turf.booleanEqual(pt2, pt3);
 * //= false
 */
function booleanEqual(feature1, feature2) {
    const type1 = getGeom(feature1);
    const type2 = getGeom(feature2);
    if (type1.type !== type2.type) return false;

    if (type1.type === 'Point') return compareCoords(type1.coordinates, type2.coordinates);
    if (type1.type === 'MultiPoint') return compareLine(type1.coordinates, type2.coordinates);


    if (type1.type === 'LineString') return compareLine(type1.coordinates, type2.coordinates, type1.type);

    if (type1.type === 'Polygon') {

        // If we have a different number of holes & outside rings
        if (type1.coordinates[0].length !== type2.coordinates[0].length) return false;

        for (let i = 0; i < type1.coordinates.length; i++) {
            if (!compareLine(type1.coordinates[i], type2.coordinates[i], type1.type)) return false;
        }
        return true;
    }

}

export default booleanEqual;


function compareCoords(pair1, pair2) {
    if (pair1[0] !== pair2[0] || pair1[1] !== pair2[1]) return false;
    return true;
}

function compareLine(line1Coords, line2Coords, type) {
    if (line1Coords.length !== line2Coords.length) {
        line1Coords = cleanLine(line1Coords);
        line2Coords = cleanLine(line2Coords);
        if (line1Coords.length !== line2Coords.length) return false;
    }

    if (type === 'LineString' && !compareCoords(line1Coords[0], line2Coords[0])) {
        if (checkIfLineGoesOppositeWay(line1Coords, line2Coords)) {
            return compareLineBackwards(line1Coords, line2Coords);
        }
    } else if (type === 'Polygon' && !compareCoords(line1Coords[1], line2Coords[1])) {
        let doesMatchExist = findCoordIndexMatch(line1Coords[1], line2Coords);
        if (doesMatchExist > -1) {
            const doPolysGoSameWay = checkPolysGoSameWay(line1Coords, line2Coords, doesMatchExist);
            if (!doPolysGoSameWay) {
                line2Coords = line2Coords.reverse();
                doesMatchExist = findCoordIndexMatch(line1Coords[1], line2Coords);
            }
            line2Coords = rejigPolygon(line2Coords, doesMatchExist);
        }

    }

    for (let i = 1; i < line1Coords.length; i++) {
        if (!compareCoords(line1Coords[i], line2Coords[i])) return false;
    }
    return true;
}

function findCoordIndexMatch(line1Coord, line2Coords) {
    for (let i = 0; i < line2Coords.length; i++) {
        if (compareCoords(line1Coord, line2Coords[i])) {
            return i;
        }
    }
    return -1;
}

function rejigPolygon(coords, index) {
    const oldCoords = coords.splice(0, index - 1);
    coords.pop();
    coords = coords.concat(oldCoords);
    coords.push(coords[0]);
    return coords;
}

function cleanLine(line) {
    return cleanCoords(lineString(line)).geometry.coordinates;
}

function checkIfLineGoesOppositeWay(line1Coords, line2Coords) {
    return compareCoords(line1Coords[0], line2Coords[line2Coords.length - 1]);
}

function checkPolysGoSameWay(line1Coords, line2Coords, matchIndex) {
    return compareCoords(line1Coords[2], line2Coords[matchIndex + 1]);
}

function compareLineBackwards(line1Coords, line2Coords) {
    line2Coords = line2Coords.reverse();
    for (let i = 0; i < line1Coords.length; i++) {
        if (!compareCoords(line1Coords[i], line2Coords[i])) {
            return false;
        }
    }
    return true;
}
