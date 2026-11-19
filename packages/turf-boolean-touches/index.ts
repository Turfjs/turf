import { Feature, Geometry, Position } from "geojson";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { getGeom } from "@turf/invariant";

/**
 * Boolean-touches true if none of the points common to both geometries
 * intersect the interiors of both geometries.
 *
 * @function
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 * var point = turf.point([1, 1]);
 *
 * turf.booleanTouches(point, line);
 * //=true
 */
function booleanTouches(
  feature1: Feature<any> | Geometry,
  feature2: Feature<any> | Geometry
): boolean {
  const geom1 = getGeom(feature1);
  const geom2 = getGeom(feature2);
  const a = toShape(geom1, "feature1");
  const b = toShape(geom2, "feature2");

  // Two puntal geometries have no boundary, so they can never touch.
  if (a.dim === 0 && b.dim === 0) {
    throw new Error("feature2 " + geom2.type + " geometry not supported");
  }
  if (!boundsOverlap(a.points, b.points)) return false;

  // Geometries touch when they share at least one point and every shared
  // point lies on the boundary of at least one of them (DE-9IM touches).
  let intersects = false;
  for (const [locA, locB] of sharedLocations(a, b)) {
    if (locA === EXTERIOR || locB === EXTERIOR) continue;
    intersects = true;
    if (interiorsMeet(a, locA, b, locB)) return false;
  }
  for (const [locB, locA] of sharedLocations(b, a)) {
    if (locA === EXTERIOR || locB === EXTERIOR) continue;
    intersects = true;
    if (interiorsMeet(a, locA, b, locB)) return false;
  }
  if (a.dim === 2 && b.dim === 2 && polygonsShareInteriorSide(a, b)) {
    return false;
  }
  return intersects;
}

const INTERIOR = 0;
const BOUNDARY = 1;
const EXTERIOR = 2;
type Location = typeof INTERIOR | typeof BOUNDARY | typeof EXTERIOR;

interface Edge {
  start: Position;
  end: Position;
  // +1 when the polygon interior is on the left of start -> end, -1 when it
  // is on the right. 0 for lines.
  interiorSide: number;
}

interface Shape {
  dim: 0 | 1 | 2;
  geom: Geometry;
  points: Position[];
  edges: Edge[];
  // Endpoints of lines that form their boundary (mod-2 rule).
  lineBoundary: Position[];
}

function toShape(geom: Geometry, name: string): Shape {
  const shape: Shape = {
    dim: 0,
    geom,
    points: [],
    edges: [],
    lineBoundary: [],
  };
  switch (geom.type) {
    case "Point":
      shape.points.push(geom.coordinates);
      return shape;
    case "MultiPoint":
      shape.points.push(...geom.coordinates);
      return shape;
    case "LineString":
      shape.dim = 1;
      addLines(shape, [geom.coordinates]);
      return shape;
    case "MultiLineString":
      shape.dim = 1;
      addLines(shape, geom.coordinates);
      return shape;
    case "Polygon":
      shape.dim = 2;
      addPolygon(shape, geom.coordinates);
      return shape;
    case "MultiPolygon":
      shape.dim = 2;
      for (const polygon of geom.coordinates) addPolygon(shape, polygon);
      return shape;
    default:
      throw new Error(name + " " + geom.type + " geometry not supported");
  }
}

function addLines(shape: Shape, lines: Position[][]) {
  const endpoints: Position[] = [];
  for (const line of lines) {
    addRing(shape, line, 0);
    endpoints.push(line[0], line[line.length - 1]);
  }
  // An endpoint is on the boundary when an odd number of line ends meet there,
  // so a closed line has no boundary.
  for (const point of endpoints) {
    const count = endpoints.filter((other) => samePosition(point, other));
    if (
      count.length % 2 === 1 &&
      !shape.lineBoundary.some((p) => samePosition(p, point))
    ) {
      shape.lineBoundary.push(point);
    }
  }
}

function addPolygon(shape: Shape, rings: Position[][]) {
  rings.forEach((ring, index) => {
    const area = signedArea(ring);
    // The polygon interior is inside the outer ring and outside the holes.
    const interiorOnLeft = index === 0 ? area > 0 : area < 0;
    addRing(shape, ring, interiorOnLeft ? 1 : -1);
  });
}

function addRing(shape: Shape, coords: Position[], interiorSide: number) {
  for (const coord of coords) shape.points.push(coord);
  for (let i = 0; i < coords.length - 1; i++) {
    if (samePosition(coords[i], coords[i + 1])) continue;
    shape.edges.push({ start: coords[i], end: coords[i + 1], interiorSide });
  }
}

// Locations, relative to `shape` and `other`, of every place where the
// interiors or boundaries of the two could first meet: the vertices of
// `shape`, the points where its edges cross edges of `other`, and the pieces
// of its edges between those points.
function* sharedLocations(
  shape: Shape,
  other: Shape
): Generator<[Location, Location]> {
  for (const point of shape.points) {
    yield [locate(point, shape), locate(point, other)];
  }
  const edgeLocation = shape.dim === 1 ? INTERIOR : BOUNDARY;
  for (const edge of shape.edges) {
    const splits = [0, 1];
    for (const point of other.points) {
      if (onSegment(point, edge.start, edge.end)) {
        splits.push(segmentParameter(point, edge));
      }
    }
    for (const otherEdge of other.edges) {
      const t = properCrossing(edge, otherEdge);
      if (t === undefined) continue;
      splits.push(t);
      // The crossing is inside both edges, so it is on the interior of a
      // line and on the boundary of a polygon.
      yield [edgeLocation, other.dim === 1 ? INTERIOR : BOUNDARY];
    }
    splits.sort((x, y) => x - y);
    for (let i = 0; i < splits.length - 1; i++) {
      if (splits[i] === splits[i + 1]) continue;
      const t = (splits[i] + splits[i + 1]) / 2;
      yield [edgeLocation, locatePiece(edge, t, other)];
    }
  }
}

function interiorsMeet(
  a: Shape,
  locA: Location,
  b: Shape,
  locB: Location
): boolean {
  if (locA === INTERIOR && locB === INTERIOR) return true;
  // The interior of a polygon is open, so any point of the other geometry
  // inside it brings part of that geometry's interior with it.
  if (b.dim === 2 && locB === INTERIOR && a.dim > 0) return true;
  if (a.dim === 2 && locA === INTERIOR && b.dim > 0) return true;
  return false;
}

// Whether two polygons share a piece of boundary with both of their interiors
// on the same side of it, which means their interiors overlap.
function polygonsShareInteriorSide(a: Shape, b: Shape): boolean {
  for (const edgeA of a.edges) {
    for (const edgeB of b.edges) {
      if (!collinearOverlap(edgeA, edgeB)) continue;
      const dx1 = edgeA.end[0] - edgeA.start[0];
      const dy1 = edgeA.end[1] - edgeA.start[1];
      const dx2 = edgeB.end[0] - edgeB.start[0];
      const dy2 = edgeB.end[1] - edgeB.start[1];
      const sameDirection = dx1 * dx2 + dy1 * dy2 > 0 ? 1 : -1;
      if (edgeA.interiorSide * edgeB.interiorSide * sameDirection > 0) {
        return true;
      }
    }
  }
  return false;
}

function locate(point: Position, shape: Shape): Location {
  switch (shape.dim) {
    case 0:
      return shape.points.some((p) => samePosition(p, point))
        ? INTERIOR
        : EXTERIOR;
    case 1:
      if (shape.lineBoundary.some((p) => samePosition(p, point))) {
        return BOUNDARY;
      }
      return shape.edges.some((e) => onSegment(point, e.start, e.end))
        ? INTERIOR
        : EXTERIOR;
    default:
      if (shape.edges.some((e) => onSegment(point, e.start, e.end))) {
        return BOUNDARY;
      }
      return booleanPointInPolygon(point, shape.geom as any)
        ? INTERIOR
        : EXTERIOR;
  }
}

// Location relative to `shape` of the piece of `edge` around parameter `t`.
// The piece does not cross or end on `shape` between its split points, so it
// is either along an edge of `shape` or away from all of them.
function locatePiece(edge: Edge, t: number, shape: Shape): Location {
  if (shape.dim === 0) return EXTERIOR;
  const along = shape.edges.some(
    (other) =>
      collinear(edge, other) && between(projectParameter(edge, t, other), 0, 1)
  );
  if (along) return shape.dim === 1 ? INTERIOR : BOUNDARY;
  if (shape.dim === 1) return EXTERIOR;
  const point = [
    edge.start[0] + t * (edge.end[0] - edge.start[0]),
    edge.start[1] + t * (edge.end[1] - edge.start[1]),
  ];
  return booleanPointInPolygon(point, shape.geom as any, {
    ignoreBoundary: true,
  })
    ? INTERIOR
    : EXTERIOR;
}

// Parameter along `edge` where it crosses `other`, if they properly cross.
function properCrossing(edge: Edge, other: Edge): number | undefined {
  const o1 = orientation(edge.start, edge.end, other.start);
  const o2 = orientation(edge.start, edge.end, other.end);
  const o3 = orientation(other.start, other.end, edge.start);
  const o4 = orientation(other.start, other.end, edge.end);
  if (o1 * o2 >= 0 || o3 * o4 >= 0) return undefined;
  return o3 / (o3 - o4);
}

function collinearOverlap(edge: Edge, other: Edge): boolean {
  if (!collinear(edge, other)) return false;
  const t0 = segmentParameter(other.start, edge);
  const t1 = segmentParameter(other.end, edge);
  return Math.max(Math.min(t0, t1), 0) < Math.min(Math.max(t0, t1), 1);
}

function collinear(edge: Edge, other: Edge): boolean {
  return (
    orientation(other.start, other.end, edge.start) === 0 &&
    orientation(other.start, other.end, edge.end) === 0
  );
}

// Parameter on `other` of the point at parameter `t` on collinear `edge`.
function projectParameter(edge: Edge, t: number, other: Edge): number {
  const x = edge.start[0] + t * (edge.end[0] - edge.start[0]);
  const y = edge.start[1] + t * (edge.end[1] - edge.start[1]);
  return segmentParameter([x, y], other);
}

function segmentParameter(point: Position, edge: Edge): number {
  const dx = edge.end[0] - edge.start[0];
  const dy = edge.end[1] - edge.start[1];
  return (
    ((point[0] - edge.start[0]) * dx + (point[1] - edge.start[1]) * dy) /
    (dx * dx + dy * dy)
  );
}

function onSegment(point: Position, start: Position, end: Position): boolean {
  return (
    orientation(start, end, point) === 0 &&
    between(point[0], start[0], end[0], true) &&
    between(point[1], start[1], end[1], true)
  );
}

function between(value: number, a: number, b: number, inclusive = false) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return inclusive ? value >= min && value <= max : value > min && value < max;
}

function orientation(a: Position, b: Position, c: Position): number {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function signedArea(ring: Position[]): number {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return area / 2;
}

function boundsOverlap(points1: Position[], points2: Position[]): boolean {
  const box1 = bounds(points1);
  const box2 = bounds(points2);
  return (
    box1[0] <= box2[2] &&
    box2[0] <= box1[2] &&
    box1[1] <= box2[3] &&
    box2[1] <= box1[3]
  );
}

function bounds(points: Position[]): number[] {
  const box = [Infinity, Infinity, -Infinity, -Infinity];
  for (const [x, y] of points) {
    if (x < box[0]) box[0] = x;
    if (y < box[1]) box[1] = y;
    if (x > box[2]) box[2] = x;
    if (y > box[3]) box[3] = y;
  }
  return box;
}

function samePosition(p1: Position, p2: Position): boolean {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

export { booleanTouches };
export default booleanTouches;
