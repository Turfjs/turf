import { geomReduce } from '@turf/meta';

/**
 * Takes one or more features and returns their area in square meters.
 *
 * @name area
 * @param {GeoJSON} geojson input GeoJSON feature(s)
 * @returns {number} area in square meters
 * @example
 * var polygon = turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
 *
 * var area = turf.area(polygon);
 *
 * //addToMap
 * var addToMap = [polygon]
 * polygon.properties.area = area
 */
function area(geojson) {
    return geomReduce(geojson, function (value, geom) {
        return value + calculateArea(geom);
    }, 0);
}

var RADIUS = 6378137;
// var FLATTENING_DENOM = 298.257223563;
// var FLATTENING = 1 / FLATTENING_DENOM;
// var POLAR_RADIUS = RADIUS * (1 - FLATTENING);

/**
 * Calculate Area
 *
 * @private
 * @param {GeoJSON} geojson GeoJSON
 * @returns {number} area
 */
function calculateArea(geojson) {
    var area = 0, i;
    switch (geojson.type) {
    case 'Polygon':
        return polygonArea(geojson.coordinates);
    case 'MultiPolygon':
        for (i = 0; i < geojson.coordinates.length; i++) {
            area += polygonArea(geojson.coordinates[i]);
        }
        return area;
    case 'Point':
    case 'MultiPoint':
    case 'LineString':
    case 'MultiLineString':
        return 0;
    case 'GeometryCollection':
        for (i = 0; i < geojson.geometries.length; i++) {
            area += calculateArea(geojson.geometries[i]);
        }
        return area;
    }
}

function polygonArea(coords) {
    var area = 0;
    if (coords && coords.length > 0) {
        area += Math.abs(ringArea(coords[0]));
        for (var i = 1; i < coords.length; i++) {
            area -= Math.abs(ringArea(coords[i]));
        }
    }
    return area;
}

/**
 * @private
 * Calculate the approximate area of the polygon were it projected onto the earth.
 * Note that this area will be positive if ring is oriented clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
 * Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
 *
 * @param {Array<Array<number>>} coords Ring Coordinates
 * @returns {number} The approximate signed geodesic area of the polygon in square meters.
 */
function ringArea(coords) {
    var p1;
    var p2;
    var p3;
    var lowerIndex;
    var middleIndex;
    var upperIndex;
    var i;
    var area = 0;
    var coordsLength = coords.length;

    if (coordsLength > 2) {
        for (i = 0; i < coordsLength; i++) {
            if (i === coordsLength - 2) { // i = N-2
                lowerIndex = coordsLength - 2;
                middleIndex = coordsLength - 1;
                upperIndex = 0;
            } else if (i === coordsLength - 1) { // i = N-1
                lowerIndex = coordsLength - 1;
                middleIndex = 0;
                upperIndex = 1;
            } else { // i = 0 to N-3
                lowerIndex = i;
                middleIndex = i + 1;
                upperIndex = i + 2;
            }
            p1 = coords[lowerIndex];
            p2 = coords[middleIndex];
            p3 = coords[upperIndex];
            area += (rad(p3[0]) - rad(p1[0])) * Math.sin(rad(p2[1]));
        }

        area = area * RADIUS * RADIUS / 2;
    }

    return area;
}

function rad(_) {
    return _ * Math.PI / 180;
}

export default area;
