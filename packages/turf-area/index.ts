import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Point,
} from "geojson";
import { earthRadius } from "@turf/helpers";
import { geomReduce, featureEach } from "@turf/meta";

// would be in @turf/meta

// with initial value specified, things are relatively straightforward
export function featureReduce<R, T extends Feature | FeatureCollection>(
  geojson: T,
  callback: (
    previousValue: R,
    currentFeature: T extends FeatureCollection<infer G, infer P>
      ? Feature<G, P>
      : T,
    featureIndex: number
  ) => R,
  initialValue: R
): R;

// with no initial value specified, previousValue can sometimes be Feature<G,P>
// the return value may also be undefined if we get a FeatureCollection without a guaranteed first element
export function featureReduce<T extends Feature | FeatureCollection>(
  geojson: T,
  callback: (
    previousValue: T extends FeatureCollection<infer G, infer P>
      ? Feature<G, P>
      : T,
    currentFeature: T extends FeatureCollection<infer G, infer P>
      ? Feature<G, P>
      : T,
    featureIndex: number
  ) => T extends FeatureCollection<infer G, infer P> ? Feature<G, P> : T
): T extends Feature
  ? T
  : T extends { features: [Feature<infer G, infer P>] }
    ? Feature<G, P>
    : T extends FeatureCollection<infer G, infer P>
      ? Feature<G, P> | undefined
      : never;

export function featureReduce<R, T extends Feature | FeatureCollection>(
  geojson: T,
  callback: (
    previousValue: R | T extends FeatureCollection<infer G, infer P>
      ? Feature<G, P>
      : T,
    currentFeature: T extends FeatureCollection<infer G, infer P>
      ? Feature<G, P>
      : T,
    featureIndex: number
  ) => R,
  initialValue?: R
): T extends Feature ? R : R | undefined {
  var previousValue: R | T extends FeatureCollection<infer G, infer P>
    ? Feature<G, P>
    : T = initialValue as any;
  featureEach(geojson, function (currentFeature, featureIndex) {
    if (featureIndex === 0 && initialValue === undefined)
      previousValue = currentFeature as any;
    else
      previousValue = callback(
        previousValue,
        currentFeature as any,
        featureIndex
      ) as any;
  });
  return previousValue as any;
}

const feature: Feature<Point> = {
  type: "Feature",
  geometry: { type: "Point", coordinates: [0, 0] },
  properties: {},
};

const featureCollection: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: [feature],
};

const emptyFeatureCollection: FeatureCollection<Point> & { features: never[] } =
  {
    type: "FeatureCollection",
    features: [],
  };

// a FeatureCollection where we know that there is at least one feature (somehow)
const populatedFeatureCollection: {
  type: "FeatureCollection";
  features: [Feature<Point, GeoJsonProperties>];
} = {
  type: "FeatureCollection",
  features: [feature],
};

const r1 = featureReduce(feature, (_acc, f, _i) => f);
const r2 = featureReduce(feature, (acc, _f, _i) => acc + 1, 0);
const r3 = featureReduce(featureCollection, (acc, f, _i) => f);
const r4 = featureReduce(featureCollection, (acc, _f, _i) => acc + 1, 0);
const r5 = featureReduce(emptyFeatureCollection, (acc, f, _i) => f);
const r6 = featureReduce(emptyFeatureCollection, (acc, _f, _i) => acc + 1, 0);
const r7 = featureReduce(populatedFeatureCollection, (acc, f, _i) => f);
const r8 = featureReduce(
  populatedFeatureCollection,
  (acc, _f, _i) => acc + 1,
  0
);

/**
 * Calculates the geodesic area in square meters of one or more polygons.
 *
 * @function
 * @param {GeoJSON} geojson input polygon(s) as {@link Geometry}, {@link Feature}, or {@link FeatureCollection}
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
  const coordsLength = coords.length - 1;

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
