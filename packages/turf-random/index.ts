import {
  BBox,
  FeatureCollection,
  LineString,
  Point,
  Polygon,
  Position,
} from "geojson";
import {
  featureCollection,
  isNumber,
  isObject,
  lineString,
  point,
  polygon,
  validateBBox,
} from "@turf/helpers";

/**
 * Returns a random position within a {@link bounding box}.
 *
 * @name randomPosition
 * @param {Array<number>} [bbox=[-180, -90, 180, 90]] a bounding box inside of which positions are placed.
 * @returns {Array<number>} Position [longitude, latitude]
 * @throws {Error} if bbox is invalid
 * @example
 * var position = turf.randomPosition([-180, -90, 180, 90])
 * // => position
 */
export function randomPosition(bbox?: BBox | { bbox: BBox }): Position {
  checkBBox(bbox);
  return randomPositionUnchecked(bbox);
}

// does not check bbox for validity, that is handled by the exported functions
function randomPositionUnchecked(bbox?: BBox | { bbox: BBox }): Position {
  if (Array.isArray(bbox)) {
    return coordInBBox(bbox);
  }
  if (bbox && bbox.bbox) {
    return coordInBBox(bbox.bbox);
  }
  return [lon(), lat()];
}

function checkBBox(bbox?: BBox | { bbox: BBox }) {
  if (bbox == null) {
    return;
  } else if (Array.isArray(bbox)) {
    validateBBox(bbox);
  } else if (bbox.bbox != null) {
    validateBBox(bbox.bbox);
  }
}

/**
 * Returns a random {@link point}.
 *
 * @name randomPoint
 * @param {number} [count=1] how many geometries will be generated
 * @param {Object} [options={}] Optional parameters
 * @param {Array<number>} [options.bbox=[-180, -90, 180, 90]] a bounding box inside of which geometries are placed.
 * @returns {FeatureCollection<Point>} GeoJSON FeatureCollection of points
 * @throws {Error} if bbox is invalid
 * @example
 * var points = turf.randomPoint(25, {bbox: [-180, -90, 180, 90]})
 * // => points
 */
export function randomPoint(
  count?: number,
  options: {
    bbox?: BBox;
  } = {}
): FeatureCollection<Point, any> {
  checkBBox(options.bbox);
  if (count === undefined || count === null) {
    count = 1;
  }
  const features = [];
  for (let i = 0; i < count; i++) {
    features.push(point(randomPositionUnchecked(options.bbox)));
  }
  return featureCollection(features);
}

/**
 * Returns a random {@link polygon}.
 *
 * @name randomPolygon
 * @param {number} [count=1] how many geometries will be generated
 * @param {Object} [options={}] Optional parameters
 * @param {Array<number>} [options.bbox=[-180, -90, 180, 90]] a bounding box inside of which geometries are placed.
 * @param {number} [options.num_vertices=10] is how many coordinates each LineString will contain.
 * @param {number} [options.max_radial_length=10] is the maximum number of decimal degrees latitude or longitude that a
 * vertex can reach out of the center of the Polygon.
 * @returns {FeatureCollection<Polygon>} GeoJSON FeatureCollection of polygons
 * @throws {Error} if bbox is invalid
 * @example
 * var polygons = turf.randomPolygon(25, {bbox: [-180, -90, 180, 90]})
 * // => polygons
 */
export function randomPolygon(
  count?: number,
  options: {
    bbox?: BBox;
    num_vertices?: number;
    max_radial_length?: number;
  } = {}
): FeatureCollection<Polygon, any> {
  checkBBox(options.bbox);
  // Default param
  if (count === undefined || count === null) {
    count = 1;
  }
  if (!isNumber(options.num_vertices) || options.num_vertices === undefined) {
    options.num_vertices = 10;
  }
  if (
    !isNumber(options.max_radial_length) ||
    options.max_radial_length === undefined
  ) {
    options.max_radial_length = 10;
  }

  const features = [];
  for (let i = 0; i < count; i++) {
    let vertices: any[] = [];
    const circleOffsets = [...Array(options.num_vertices + 1)].map(Math.random);

    // Sum Offsets
    circleOffsets.forEach((cur: any, index: number, arr: any[]) => {
      arr[index] = index > 0 ? cur + arr[index - 1] : cur;
    });

    // scaleOffsets
    circleOffsets.forEach((cur: any) => {
      cur = (cur * 2 * Math.PI) / circleOffsets[circleOffsets.length - 1];
      const radialScaler = Math.random();
      vertices.push([
        radialScaler * (options.max_radial_length || 10) * Math.sin(cur),
        radialScaler * (options.max_radial_length || 10) * Math.cos(cur),
      ]);
    });
    vertices[vertices.length - 1] = vertices[0]; // close the ring

    // center the polygon around something
    vertices = vertices.map(
      vertexToCoordinate(randomPositionUnchecked(options.bbox))
    );
    features.push(polygon([vertices]));
  }
  return featureCollection(features);
}

/**
 * Returns a random {@link linestring}.
 *
 * @name randomLineString
 * @param {number} [count=1] how many geometries will be generated
 * @param {Object} [options={}] Optional parameters
 * @param {Array<number>} [options.bbox=[-180, -90, 180, 90]] a bounding box inside of which geometries are placed.
 * @param {number} [options.num_vertices=10] is how many coordinates each LineString will contain.
 * @param {number} [options.max_length=0.0001] is the maximum number of decimal degrees that a
 * vertex can be from its predecessor
 * @param {number} [options.max_rotation=Math.PI / 8] is the maximum number of radians that a
 * line segment can turn from the previous segment.
 * @returns {FeatureCollection<LineString>} GeoJSON FeatureCollection of linestrings
 * @throws {Error} if bbox is invalid
 * @example
 * var lineStrings = turf.randomLineString(25, {bbox: [-180, -90, 180, 90]})
 * // => lineStrings
 */
export function randomLineString(
  count?: number,
  options: {
    bbox?: BBox;
    num_vertices?: number;
    max_length?: number;
    max_rotation?: number;
  } = {}
): FeatureCollection<LineString, any> {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) {
    throw new Error("options is invalid");
  }
  const bbox = options.bbox;
  checkBBox(bbox);
  let num_vertices = options.num_vertices;
  let max_length = options.max_length;
  let max_rotation = options.max_rotation;
  if (count === undefined || count === null) {
    count = 1;
  }

  // Default parameters
  if (
    !isNumber(num_vertices) ||
    num_vertices === undefined ||
    num_vertices < 2
  ) {
    num_vertices = 10;
  }
  if (!isNumber(max_length) || max_length === undefined) {
    max_length = 0.0001;
  }
  if (!isNumber(max_rotation) || max_rotation === undefined) {
    max_rotation = Math.PI / 8;
  }

  const features = [];
  for (let i = 0; i < count; i++) {
    const startingPoint = randomPositionUnchecked(bbox);
    const vertices = [startingPoint];
    for (let j = 0; j < num_vertices - 1; j++) {
      const priorAngle =
        j === 0
          ? Math.random() * 2 * Math.PI
          : Math.tan(
              (vertices[j][1] - vertices[j - 1][1]) /
                (vertices[j][0] - vertices[j - 1][0])
            );
      const angle = priorAngle + (Math.random() - 0.5) * max_rotation * 2;
      const distance = Math.random() * max_length;
      vertices.push([
        vertices[j][0] + distance * Math.cos(angle),
        vertices[j][1] + distance * Math.sin(angle),
      ]);
    }
    features.push(lineString(vertices));
  }

  return featureCollection(features);
}

function vertexToCoordinate(hub: number[]) {
  return (cur: number[]) => {
    return [cur[0] + hub[0], cur[1] + hub[1]];
  };
}

function rnd() {
  return Math.random() - 0.5;
}
function lon() {
  return rnd() * 360;
}
function lat() {
  return rnd() * 180;
}

function coordInBBox(bbox: BBox) {
  return [
    Math.random() * (bbox[2] - bbox[0]) + bbox[0],
    Math.random() * (bbox[3] - bbox[1]) + bbox[1],
  ];
}
