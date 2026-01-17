import { PolyPathD, PathD, PathsD, PolyTreeD, areaD } from "clipper2-ts";
import { Polygon, MultiPolygon, Position } from "geojson";

/*
 * Clipper2 scaling factor used when converting between decimal and integer
 * values for internal clipper2 calculations.
 * For Turf's purposes defaults to 8 decimal places retained, which is approx
 * 1mm if using decimal degrees at the equator.
 */
const TURF_CLIPPER2_SCALE_FACTOR = 8;

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
 * Construct the output Geojson based on a clipper2 tree. The tree is useful
 * for propertly handing holes.
 *
 * @param polyTree hierarchy of outer and inner contours found by clipper2
 */
function polyTreeToGeoJSON(polyTree: PolyTreeD): Polygon | MultiPolygon | null {
  const polygons: Position[][][] = [];

  // Process each top-level polygon (initally all outer contours)
  for (let i = 0; i < polyTree.count; i++) {
    const child = polyTree.child(i);
    processPolyPath(child, polygons);
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

/**
 * Processes a polyPath. Depending on whether the path denotes an outer ring or a hole, will add a polygon to the list of polygons.
 * Recurses to children of this polyPath in turn.
 *
 * @param polyPath outer or inner contour of a polygon to process
 * @param polygons array of completed polygons that this function may add to
 */
function processPolyPath(polyPath: PolyPathD, polygons: Position[][][]) {
  // Don't look closely at holes during recursion ...
  if (!polyPath.isHole) {
    const rings: Position[][] = [];
    // Add the outer ring.
    const outerRing = pathToCoordinates(polyPath.poly);
    if (outerRing.length > 0) {
      rings.push(outerRing);
    }

    // ... instead add holes here.
    // Add any holes (direct children are the holes). Do this now rather than
    // during recursion given we already have the outer ring handy.
    for (let i = 0; i < polyPath.count; i++) {
      const child = polyPath.child(i);

      const holeRing = pathToCoordinates(child.poly);
      if (holeRing.length > 0) {
        rings.push(holeRing);
      }
    }
    polygons.push(rings);
  }

  // Now recurse into each child to handle nested levels.
  for (let i = 0; i < polyPath.count; i++) {
    processPolyPath(polyPath.child(i), polygons);
  }
}

/**
 * Converts a clipper2 path to an array of Geojson Positions.
 * Automatically closes the path unless overridden e.g. for a lineString.
 *
 * @param path clipper2 path to convert to Positions
 * @param [closeIt=true] close the path by making sure first and last positions are equal
 */
function pathToCoordinates(
  path: PathD | null,
  closeIt: boolean = true
): Position[] {
  const coords: Position[] = [];

  if (!path || typeof path.length !== "number") {
    return coords;
  }

  for (let i = 0; i < path.length; i++) {
    const pt = path[i];
    coords.push([pt.x, pt.y]);
  }

  // GeoJSON requires the first and last coordinates to be identical (closed ring)
  if (coords.length > 0 && closeIt) {
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
  TURF_CLIPPER2_SCALE_FACTOR,
};
