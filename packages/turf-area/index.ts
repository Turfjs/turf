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
export default function area(
  geojson: Feature<any> | FeatureCollection<any> | Geometry
) {
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
function ringArea(coords: number[][]) {
  let p1;
  let p2;
  let p3;
  let lowerIndex;
  let middleIndex;
  let upperIndex;
  let i;
  let total = 0;
  const coordsLength = coords.length;

  if (coordsLength > 2) {
    for (i = 0; i < coordsLength; i++) {
      if (i === coordsLength - 2) {
        // i = N-2
        lowerIndex = coordsLength - 2;
        middleIndex = coordsLength - 1;
        upperIndex = 0;
      } else if (i === coordsLength - 1) {
        // i = N-1
        lowerIndex = coordsLength - 1;
        middleIndex = 0;
        upperIndex = 1;
      } else {
        // i = 0 to N-3
        lowerIndex = i;
        middleIndex = i + 1;
        upperIndex = i + 2;
      }
      p1 = coords[lowerIndex];
      p2 = coords[middleIndex];
      p3 = coords[upperIndex];
      total += (rad(p3[0]) - rad(p1[0])) * Math.sin(rad(p2[1]));
    }

    total = (total * earthRadius * earthRadius) / 2;
  }
  return total;
}

function rad(num: number) {
  return (num * Math.PI) / 180;
}
