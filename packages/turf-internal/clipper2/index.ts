import { PolyPathD, PathD, PathsD, PolyTreeD, areaD } from "clipper2-ts";
import { Polygon, MultiPolygon, Position } from "geojson";

const DEFAULT_PRECISION = 8;

/**
 * Converts a multipolygon to a flattened array of clipper2 paths.
 */
function multiPolygonToPaths(coords: Position[][][]): PathsD {
  const paths: PathsD = [];

  for (const polygon of coords) {
    paths.push(...polygonToPaths(polygon));
  }

  return paths;
}

/**
 * Converts a polygon to a flattened array of clipper2 paths.
 */
function polygonToPaths(coords: Position[][]): PathsD {
  const paths: PathsD = [];

  for (const [idx, ring] of coords.entries()) {
    // Defensive checking against incorrectly wound Geojson polygons.
    const checkedRing =
      idx === 0
        ? enforceOuterRing(ringToPath(ring))
        : enforceInnerRing(ringToPath(ring));

    paths.push(checkedRing);
  }

  return paths;
}

/**
 * Make sure this ring is wound as an outer ring, according to clipper2
 * expectations. That is, clockwise.
 */
function enforceOuterRing(path: PathD): PathD {
  if (areaD(path) < 0) {
    // Leave original array untouched.
    return [...path].reverse();
  }

  return path;
}

/**
 * Make sure this ring is wound as an inner ring, according to clipper2
 * expectations. That is, counter clockwise.
 */
function enforceInnerRing(path: PathD): PathD {
  if (areaD(path) > 0) {
    // Leave original array untouched.
    return [...path].reverse();
  }

  return path;
}

/**
 * Converts a ring to a clipper2 path.
 */
function ringToPath(ring: Position[]): PathD {
  return ring.map(([x, y]) => ({ x, y }));
}

/**
 * Construct the output Geojson based on a clipper2 tree. The tree is useful for propertly handing holes.
 */
function polyTreeToGeoJSON(polyTree: PolyTreeD): Polygon | MultiPolygon | null {
  const polygons: Position[][][] = [];

  // Process each top-level polygon (outer contours)
  for (let i = 0; i < polyTree.count; i++) {
    const child = polyTree.child(i);
    if (child && !child.isHole) {
      const polygon = processPolyPath(child);
      if (polygon.length > 0) {
        polygons.push(polygon);
      }
    }
  }

  if (polygons.length === 0) {
    return null;
  }

  // If exactly 1 polygon return as Geojson Polygon
  if (polygons.length === 1) {
    return {
      type: "Polygon",
      coordinates: polygons[0],
    };
  }

  // If anything else return as MultiPolygon
  return {
    type: "MultiPolygon",
    coordinates: polygons,
  };
}

function processPolyPath(polyPath: PolyPathD): Position[][] {
  const rings: Position[][] = [];

  // Add the outer ring (contour)
  const outerRing = pathToCoordinates(polyPath.poly);
  if (outerRing.length > 0) {
    rings.push(outerRing);
  }

  // Add any holes (children are the holes)
  for (let i = 0; i < polyPath.count; i++) {
    const child = polyPath.child(i);
    if (child && child.isHole) {
      const holeRing = pathToCoordinates(child.poly);
      if (holeRing.length > 0) {
        rings.push(holeRing);
      }

      // Expectation is pools within islands within lakes within continents ...
      // are handled as multipolygons. So further recursion is not required.
    }
  }

  return rings;
}

/**
 * Converts a clipper2 integer path to an array of Geojson Positions.
 */
function pathToCoordinates(path: PathD | null): Position[] {
  const coords: Position[] = [];

  if (!path || typeof path.length !== "number") {
    return coords;
  }

  for (let i = 0; i < path.length; i++) {
    const pt = path[i];
    coords.push([pt.x, pt.y]);
  }

  // GeoJSON requires the first and last coordinates to be identical (closed ring)
  if (coords.length > 0) {
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      coords.push([first[0], first[1]]);
    }
  }

  return coords;
}

export {
  multiPolygonToPaths,
  polygonToPaths,
  polyTreeToGeoJSON,
  DEFAULT_PRECISION,
};
