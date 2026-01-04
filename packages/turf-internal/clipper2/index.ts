import { PolyTree64, Path64, Paths64, PolyPath64 } from "clipper2-ts";
import { Polygon, MultiPolygon, Position } from "geojson";

// Multiplier applied to lat lng before passing to clipper2. Implies
// calculations are limited to 6 decimal places.
const INT_MULT = 1_000_000;

/**
 * Converts a multipolygon to a flattened array of clipper2 paths.
 */
function multiPolygonToPaths(coords: Position[][][]): Paths64 {
  const paths: Paths64 = [];

  for (const polygon of coords) {
    paths.push(...polygonToPaths(polygon));
  }

  return paths;
}

/**
 * Converts a polygon to a flattened array of clipper2 paths.
 */
function polygonToPaths(coords: Position[][]): Paths64 {
  const paths: Paths64 = [];

  for (const ring of coords) {
    paths.push(ringToPath(ring));
  }

  return paths;
}

/**
 * Converts a ring to a clipper2 paths.
 */
function ringToPath(ring: Position[]): Path64 {
  return ring.map(([x, y]) => ({
    x: Math.trunc(x * INT_MULT),
    y: Math.trunc(y * INT_MULT),
  }));
}

/**
 * Construct the output Geojson based on a clipper2 tree. The tree is useful for propertly handing holes.
 */
function polyTreeToGeoJSON(polyTree: PolyTree64): Polygon | MultiPolygon {
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

  // If exactly 1 polygon return as Geojson Polygon
  if (polygons.length === 1) {
    return {
      type: "Polygon",
      coordinates: polygons[0],
    };
  }

  // If anything else (including 0) return as MultiPolygon
  return {
    type: "MultiPolygon",
    coordinates: polygons,
  };
}

function processPolyPath(polyPath: PolyPath64): Position[][] {
  const rings: Position[][] = [];

  // Add the outer ring (contour)
  const outerRing = pathToCoordinates(polyPath.polygon);
  if (outerRing.length > 0) {
    rings.push(outerRing);
  }

  // Add any holes (children are the holes)
  for (let i = 0; i < polyPath.count; i++) {
    const child = polyPath.child(i);
    if (child && child.isHole) {
      const holeRing = pathToCoordinates(child.polygon);
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
function pathToCoordinates(path: Path64 | null): Position[] {
  const coords: Position[] = [];

  if (!path || typeof path.length !== "number") {
    return coords;
  }

  for (let i = 0; i < path.length; i++) {
    const pt = path[i];
    coords.push([Number(pt.x) / INT_MULT, Number(pt.y) / INT_MULT]);
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

export { multiPolygonToPaths, polygonToPaths, polyTreeToGeoJSON };
