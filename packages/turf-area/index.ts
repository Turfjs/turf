import { Feature, FeatureCollection, Geometry } from "geojson";
import { earthRadius } from "@turf/helpers";
import { geomReduce } from "@turf/meta";

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
function area(geojson: Feature<any> | FeatureCollection<any> | Geometry) {
  return geomReduce(
    geojson,
    (value, geom) => {
      return value + calculateArea(geom);
    },
    0
  );
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
 * A constant factor used to compute the area of a polygon.
 * It's derived from the square of the Earth's radius divided by 2.
 *
 * @type {number}
 */
const FACTOR = (earthRadius * earthRadius) / 2;

/**
 * @private
 * A constant used for converting degrees to radians.
 * Represents the ratio of PI to 180.
 *
 * @type {number}
 */
const PI_OVER_180 = Math.PI / 180;

/**
 * @private
 * Calculate the approximate area of the polygon were it projected onto the earth.
 * Note that this area will be positive if ring is oriented clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for Polygons on a Sphere",
 * JPL Publication 07-03, Jet Propulsion
 * Laboratory, Pasadena, CA, June 2007 https://trs.jpl.nasa.gov/handle/2014/40409
 *
 * @param {Array<Array<number>>} coords Ring Coordinates
 * @returns {number} The approximate signed geodesic area of the polygon in square meters.
 */
function ringArea(coords: number[][]): number {
  const coordsLength = coords.length;

  if (coordsLength <= 2) return 0;
  let total = 0;

  let i = 0;
  while (i < coordsLength) {
    const lower = coords[i];
    const middle = coords[i + 1 === coordsLength ? 0 : i + 1];
    const upper =
      coords[i + 2 >= coordsLength ? (i + 2) % coordsLength : i + 2];

    const lowerX = lower[0] * PI_OVER_180;
    const middleY = middle[1] * PI_OVER_180;
    const upperX = upper[0] * PI_OVER_180;

    total += (upperX - lowerX) * Math.sin(middleY);

    i++;
  }

  return total * FACTOR;
}

export { area };
export default area;
