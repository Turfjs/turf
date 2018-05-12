import { Feature, FeatureCollection, Geometry } from "@turf/helpers";
import { geomReduce } from "@turf/meta";

// Note: change RADIUS => earthRadius
const RADIUS = 6378137;

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
export default function area(geojson: Feature<any> | FeatureCollection<any> | Geometry) {
    return geomReduce(geojson, (value, geom) => {
        return value + calculateArea(geom);
    }, 0);
}

/**
 * Calculate Area
 *
 * @private
 * @param {Geometry} geom GeoJSON Geometries
 * @returns {number} area
 */
function calculateArea(geom: Geometry): number {
    let total = 0;
    let i;
    switch (geom.type) {
    case "Polygon":
        return polygonArea(geom.coordinates);
    case "MultiPolygon":
        for (i = 0; i < geom.coordinates.length; i++) {
            total += polygonArea(geom.coordinates[i]);
        }
        return total;
    case "Point":
    case "MultiPoint":
    case "LineString":
    case "MultiLineString":
        return 0;
    }
    return 0;
}

function polygonArea(coords: any) {
    let total = 0;
    if (coords && coords.length > 0) {
        total += Math.abs(ringArea(coords[0]));
        for (let i = 1; i < coords.length; i++) {
            total -= Math.abs(ringArea(coords[i]));
        }
    }
    return total;
}

/**
 * @private
 * Calculate the approximate area of the polygon were it projected onto the earth.
 * Note that this area will be positive if ring is oriented clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for Polygons on a Sphere",
 * JPL Publication 07-03, Jet Propulsion
 * Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
 *
 * @param {Array<Array<number>>} coords Ring Coordinates
 * @returns {number} The approximate signed geodesic area of the polygon in square meters.
 */

const FACTOR = RADIUS * RADIUS / 2;

function ringArea(coords: number[][]) {
    // it's a ring - ignore the last one
    const coordsLength = coords.length - 1;

    if (coordsLength < 3) {
        return 0;
    }

    let total = 0;

    const f_x = rad(coords[0][0]), f_y = rad(coords[0][1]);
    const s_x = rad(coords[1][0]), s_y = rad(coords[1][1]);

    let l_x = f_x, l_y = f_y;
    let m_x = s_x, m_y = s_y;

    let u_x = 0, u_y = 0;

    for (let i = 2; i < coordsLength; i++) {
        u_x = rad(coords[i][0]); u_y = rad(coords[i][1]);

        total += (u_x - l_x) * Math.sin(m_y);

        l_x = m_x; l_y = m_y;
        m_x = u_x; m_y = u_y;
    }

    // handle 2 extra triangles (since we started from i = 2)

    u_x = f_x; u_y = f_y;

    total += (u_x - l_x) * Math.sin(m_y);

    l_x = m_x; l_y = m_y;
    m_x = u_x; m_y = u_y;

    u_x = s_x; u_y = s_y;

    total += (u_x - l_x) * Math.sin(m_y);

    return total * FACTOR;
}

function rad(num: number) {
    return num * Math.PI / 180;
}
