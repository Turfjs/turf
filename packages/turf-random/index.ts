import {
  BBox,
  FeatureCollection,
  LineString,
  Point,
  Polygon,
  Position,
} from "geojson";
import {
  degreesToRadians,
  featureCollection,
  isNumber,
  isObject,
  lengthToDegrees,
  lineString,
  point,
  polygon,
  validateBBox,
} from "@turf/helpers";
import destination from "@turf/destination";

/**
 * Returns a random position within a {@link BBox|bounding box}.
 *
 * @function
 * @param {BBox} [bbox=[-180, -90, 180, 90]] a bounding box inside of which positions are placed.
 * @returns {Position} Position [longitude, latitude]
 * @throws {Error} if bbox is invalid
 * @example
 * var position = turf.randomPosition([-180, -90, 180, 90])
 * // => position
 */
function randomPosition(bbox?: BBox | { bbox: BBox }): Position {
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
 * @function
 * @param {number} [count=1] how many geometries will be generated
 * @param {Object} [options={}] Optional parameters
 * @param {BBox} [options.bbox=[-180, -90, 180, 90]] a bounding box inside of which geometries are placed.
 * @returns {FeatureCollection<Point>} GeoJSON FeatureCollection of points
 * @throws {Error} if bbox is invalid
 * @example
 * var points = turf.randomPoint(25, {bbox: [-180, -90, 180, 90]})
 * // => points
 */
function randomPoint(
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
 * @function
 * @param {number} [count=1] how many geometries will be generated
 * @param {Object} [options={}] Optional parameters
 * @param {BBox} [options.bbox=[-180, -90, 180, 90]] a bounding box inside of which geometries are placed.
 * @param {number} [options.numVertices=10] is how many coordinates each LineString will contain.
 * @param {number} [options.maxDistance=10] is the maximum distance that a
 * vertex can reach out of the center of the Polygon.
 * @param {Units} [options.distanceUnits='degrees'] Supports all valid distance Turf {@link https://turfjs.org/docs/api/types/Units Units}.
 * @returns {FeatureCollection<Polygon>} GeoJSON FeatureCollection of polygons
 * @throws {Error} if bbox is invalid
 * @example
 * var polygons = turf.randomPolygon(25, {bbox: [-180, -90, 180, 90]})
 * // => polygons
 */
function randomPolygon(
  count?: number,
  options: {
    bbox?: BBox;
    num_vertices?: number;
    numVertices?: number;
    max_radial_length?: number;
    maxDistance?: number;
    distanceUnits?: Units;
  } = {}
): FeatureCollection<Polygon, any> {
  checkBBox(options.bbox);

  // Default param
  if (count === undefined || count === null) {
    count = 1;
  }
  if (options.bbox === undefined || options.bbox === null) {
    options.bbox = [-180, -90, 180, 90];
  }
  // Backward compatibility requires old fashion snake case options
  let numVertices = options.numVertices || options.num_vertices;
  if (!isNumber(numVertices) || numVertices === undefined) {
    numVertices = 10;
  }
  // Backward compatibility requires old fashion snake case options
  let maxDistance = options.maxDistance || options.max_radial_length;
  if (!isNumber(maxDistance) || maxDistance === undefined) {
    maxDistance = 10;
  } else {
    maxDistance = lengthToDegrees(maxDistance, options.distanceUnits);
  }

  const bboxWidth = Math.abs(options.bbox[0] - options.bbox[2]);
  const bboxHeight = Math.abs(options.bbox[1] - options.bbox[3]);

  const maxRadius = Math.min(bboxWidth / 2, bboxHeight / 2);

  if (maxDistance > maxRadius) {
    throw new Error("maximum distance is greater than the radius of the bbox");
  }

  // Create a padded bbox to avoid the polygons to be too close to the border
  const paddedBbox = [
    options.bbox[0] + maxDistance,
    options.bbox[1] + maxDistance,
    options.bbox[2] - maxDistance,
    options.bbox[3] - maxDistance,
  ] as BBox;

  const features = [];
  for (let i = 0; i < count; i++) {
    let vertices: number[][] = [];
    const circleOffsets = [...Array(numVertices + 1)].map(Math.random);

    // Sum Offsets
    circleOffsets.forEach((cur, index, arr) => {
      arr[index] = index > 0 ? cur + arr[index - 1] : cur;
    });

    // scaleOffsets
    circleOffsets.forEach((cur) => {
      cur = (cur * 2 * Math.PI) / circleOffsets[circleOffsets.length - 1];
      const radialScaler = Math.random();
      vertices.push([
        radialScaler * maxDistance * Math.sin(cur),
        radialScaler * maxDistance * Math.cos(cur),
      ]);
    });
    vertices[vertices.length - 1] = vertices[0]; // close the ring

    // center the polygon around something
    vertices = vertices
      .reverse() // Make counter-clockwise to adhere to right hand rule.
      .map(vertexToCoordinate(randomPositionUnchecked(paddedBbox)));
    features.push(polygon([vertices]));
  }
  return featureCollection(features);
}

/**
 * Returns a random {@link LineString}.
 *
 * @function
 * @param {number} [count=1] how many geometries will be generated
 * @param {Object} [options={}] Optional parameters
 * @param {BBox} [options.bbox=[-180, -90, 180, 90]] a bounding box inside of which geometries are placed.
 * @param {number} [options.numVertices=10] is how many coordinates each LineString will contain.
 * @param {number} [options.maxDistance=0.0001] is the maximum distance that a
 * vertex can be from its predecessor
 * @param {Units} [options.distanceUnits='degrees'] Supports all valid distance Turf {@link https://turfjs.org/docs/api/types/Units Units}.
 * @param {number} [options.maxAngle=Math.PI / 8] is the maximum angle that a
 * line segment can turn from the previous segment.
 * @param {Units} [options.angleUnits='radians'] Supports all valid angular Turf {@link https://turfjs.org/docs/api/types/Units Units}.
 * @returns {FeatureCollection<LineString>} GeoJSON FeatureCollection of linestrings
 * @throws {Error} if bbox is invalid
 * @example
 * var lineStrings = turf.randomLineString(25, {bbox: [-180, -90, 180, 90]})
 * // => lineStrings
 */
function randomLineString(
  count?: number,
  options: {
    bbox?: BBox;
    num_vertices?: number;
    numVertices?: number;
    max_length?: number;
    maxDistance?: number;
    distanceUnits?: Units;
    max_rotation?: number;
    maxAngle?: number;
    angleUnits?: Units;
  } = {}
): FeatureCollection<LineString, any> {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) {
    throw new Error("options is invalid");
  }
  const bbox = options.bbox;
  checkBBox(bbox);
  // Backward compatibility requires old fashion snake case options
  let numVertices = options.numVertices || options.num_vertices;
  let maxDistance = options.maxDistance || options.max_length;
  let maxAngle = options.maxAngle || options.max_rotation;
  if (count === undefined || count === null) {
    count = 1;
  }

  // Default parameters
  if (!isNumber(numVertices) || numVertices === undefined || numVertices < 2) {
    numVertices = 10;
  }
  if (!isNumber(maxDistance) || maxDistance === undefined) {
    maxDistance = 0.0001;
  } else {
    maxDistance = lengthToDegrees(maxDistance, options.distanceUnits);
  }
  if (!isNumber(maxAngle) || maxAngle === undefined) {
    maxAngle = Math.PI / 8;
  } else if (options.angleUnits === "degrees") {
    maxAngle = degreesToRadians(maxAngle, options.distanceUnits);
  }

  const features = [];
  for (let i = 0; i < count; i++) {
    const startingPoint = randomPositionUnchecked(bbox);
    const vertices = [startingPoint];
    var priorBearing = Math.random() * 360;
    for (var j = 0; j < numVertices - 1; j++) {
      var newBearing =
        priorBearing + ((Math.random() - 0.5) * maxAngle * 2 * 180) / Math.PI;
      if (newBearing > 180) newBearing -= 360;
      var distance = Math.random() * maxDistance;
      const vertex = destination(vertices[j], distance, newBearing, {
        units: "degrees",
      });
      priorBearing = newBearing;
      vertices.push(vertex.geometry.coordinates);
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

export { randomPosition, randomPoint, randomPolygon, randomLineString };
