import {
  BBox,
  Feature,
  Geometry,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from "geojson";
import { bbox as calcBbox } from "@turf/bbox";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { booleanPointOnLine as isPointOnLine } from "@turf/boolean-point-on-line";
import { getGeom } from "@turf/invariant";
import { feature, featureCollection, lineString } from "@turf/helpers";
import { lineSplit } from "@turf/line-split";

/**
 * Tests whether geometry a contains geometry b.
 * The interiors of both geometries must intersect, and the interior and boundary of geometry b must not intersect the exterior of geometry a.
 * booleanContains(a, b) is equivalent to booleanWithin(b, a)
 *
 * @function
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 * var point = turf.point([1, 2]);
 *
 * turf.booleanContains(line, point);
 * //=true
 */
function booleanContains(
  feature1: Feature<any> | Geometry,
  feature2: Feature<any> | Geometry
) {
  const geom1 = getGeom(feature1);
  const geom2 = getGeom(feature2);
  const type1 = geom1.type;
  const type2 = geom2.type;
  const coords1 = geom1.coordinates;
  const coords2 = geom2.coordinates;

  switch (type1) {
    case "Point":
      switch (type2) {
        case "Point":
          return compareCoords(coords1, coords2);
        default:
          throw new Error("feature2 " + type2 + " geometry not supported");
      }
    case "MultiPoint":
      switch (type2) {
        case "Point":
          return isPointInMultiPoint(geom1, geom2);
        case "MultiPoint":
          return isMultiPointInMultiPoint(geom1, geom2);
        default:
          throw new Error("feature2 " + type2 + " geometry not supported");
      }
    case "LineString":
      switch (type2) {
        case "Point":
          return isPointOnLine(geom2, geom1, { ignoreEndVertices: true });
        case "LineString":
          return isLineOnLine(geom1, geom2);
        case "MultiPoint":
          return isMultiPointOnLine(geom1, geom2);
        default:
          throw new Error("feature2 " + type2 + " geometry not supported");
      }
    case "Polygon":
      switch (type2) {
        case "Point":
          return booleanPointInPolygon(geom2, geom1, { ignoreBoundary: true });
        case "LineString":
          return isLineInPoly(geom1, geom2);
        case "Polygon":
          return isPolyInPoly(geom1, geom2);
        case "MultiPoint":
          return isMultiPointInPoly(geom1, geom2);
        case "MultiPolygon":
          return isMultiPolyInPoly(geom1, geom2);
        default:
          throw new Error("feature2 " + type2 + " geometry not supported");
      }
    case "MultiPolygon":
      switch (type2) {
        case "Point":
          return isPointInMultiPolygon(geom1, geom2);
        case "MultiPoint":
          return isMultiPointInMultiPolygon(geom1, geom2);
        case "LineString":
          return isLineInMultiPolygon(geom1, geom2);
        case "MultiLineString":
          return isMultiLineStringInMultiPolygon(geom1, geom2);
        case "Polygon":
          return isPolygonInMultiPolygon(geom1, geom2);
        case "MultiPolygon":
          return isMultiPolygonInMultiPolygon(geom1, geom2);
        default:
          throw new Error("feature2 " + type2 + " geometry not supported");
      }
    default:
      throw new Error("feature1 " + type1 + " geometry not supported");
  }
}

function isPolygonInMultiPolygon(multiPolygon: MultiPolygon, polygon: Polygon) {
  // Compute the polygon's bbox once instead of once per member polygon
  const polygonBbox = calcBbox(polygon);
  return multiPolygon.coordinates.some((coords) =>
    isPolyInPoly({ type: "Polygon", coordinates: coords }, polygon, polygonBbox)
  );
}

/**
 * Is Point inside MultiPolygon
 *
 * @private
 * @param {MultiPolygon} multiPolygon MultiPolygon geometry
 * @param {Point} point Point geometry
 * @returns {boolean} true if point is inside the interior of any polygon in the MultiPolygon
 */
function isPointInMultiPolygon(multiPolygon: MultiPolygon, point: Point) {
  // booleanPointInPolygon supports MultiPolygon natively - a single call is
  // significantly cheaper than one wrapped call per member polygon
  return booleanPointInPolygon(point, multiPolygon, { ignoreBoundary: true });
}

/**
 * Is MultiPoint inside MultiPolygon
 *
 * @private
 * @param {MultiPolygon} multiPolygon MultiPolygon geometry
 * @param {MultiPoint} multiPoint MultiPoint geometry
 * @returns {boolean} true if no point is outside the MultiPolygon and at least one point is in the interior of some polygon
 */
function isMultiPointInMultiPolygon(
  multiPolygon: MultiPolygon,
  multiPoint: MultiPoint
) {
  let oneInside = false;
  for (const coord of multiPoint.coordinates) {
    // All points must be inside the MultiPolygon (boundary OK)
    if (!booleanPointInPolygon(coord, multiPolygon)) {
      return false;
    }
    // Track if at least one point is strictly in the interior
    if (!oneInside) {
      oneInside = booleanPointInPolygon(coord, multiPolygon, {
        ignoreBoundary: true,
      });
    }
  }
  // At least one point must be in the interior (not just on boundary)
  return oneInside;
}

/**
 * Is LineString inside MultiPolygon
 *
 * @private
 * @param {MultiPolygon} multiPolygon MultiPolygon geometry
 * @param {LineString} lineString LineString geometry
 * @returns {boolean} true if the LineString is fully contained within a single polygon of the MultiPolygon
 */
function isLineInMultiPolygon(
  multiPolygon: MultiPolygon,
  lineString: LineString
) {
  return multiPolygon.coordinates.some((coords) =>
    isLineInPoly({ type: "Polygon", coordinates: coords }, lineString)
  );
}

/**
 * Is MultiLineString inside MultiPolygon
 *
 * @private
 * @param {MultiPolygon} multiPolygon MultiPolygon geometry
 * @param {MultiLineString} multiLineString MultiLineString geometry
 * @returns {boolean} true if no LineString has any part in the MultiPolygon's exterior (boundary OK) and at least one LineString has a segment in the interior of some polygon
 */
function isMultiLineStringInMultiPolygon(
  multiPolygon: MultiPolygon,
  multiLineString: MultiLineString
) {
  let oneInterior = false;
  for (const lineCoords of multiLineString.coordinates) {
    const line: LineString = { type: "LineString", coordinates: lineCoords };
    // Each line must not touch the exterior of any polygon it overlaps —
    // lines lying entirely on a polygon's boundary are OK
    let lineStatus: "outside" | "boundary" | "interior" = "outside";
    for (const polyCoords of multiPolygon.coordinates) {
      const status = lineInPolyStatus(
        { type: "Polygon", coordinates: polyCoords },
        line
      );
      if (status === "interior") {
        lineStatus = status;
        break;
      }
      if (status === "boundary") {
        lineStatus = status;
      }
    }
    if (lineStatus === "outside") {
      return false;
    }
    // At least one line must have a segment strictly in some polygon's interior
    if (lineStatus === "interior") {
      oneInterior = true;
    }
  }
  return oneInterior;
}

/**
 * Is MultiPolygon inside MultiPolygon
 *
 * @private
 * @param {MultiPolygon} multiPolygon1 MultiPolygon geometry (container)
 * @param {MultiPolygon} multiPolygon2 MultiPolygon geometry (contained)
 * @returns {boolean} true if every polygon of multiPolygon2 is fully contained within some single polygon of multiPolygon1
 */
function isMultiPolygonInMultiPolygon(
  multiPolygon1: MultiPolygon,
  multiPolygon2: MultiPolygon
) {
  for (const poly2Coords of multiPolygon2.coordinates) {
    const poly2: Polygon = { type: "Polygon", coordinates: poly2Coords };
    // Compute the candidate polygon's bbox once instead of per member polygon
    const poly2Bbox = calcBbox(poly2);
    const polyInside = multiPolygon1.coordinates.some((poly1Coords) =>
      isPolyInPoly(
        { type: "Polygon", coordinates: poly1Coords },
        poly2,
        poly2Bbox
      )
    );
    if (!polyInside) {
      return false;
    }
  }
  return true;
}

function isMultiPolyInPoly(polygon: Polygon, multiPolygon: MultiPolygon) {
  return multiPolygon.coordinates.every((coords) =>
    isPolyInPoly(polygon, { type: "Polygon", coordinates: coords })
  );
}

function isPointInMultiPoint(multiPoint: MultiPoint, pt: Point) {
  let i;
  let output = false;
  for (i = 0; i < multiPoint.coordinates.length; i++) {
    if (compareCoords(multiPoint.coordinates[i], pt.coordinates)) {
      output = true;
      break;
    }
  }
  return output;
}

function isMultiPointInMultiPoint(
  multiPoint1: MultiPoint,
  multiPoint2: MultiPoint
) {
  for (const coord2 of multiPoint2.coordinates) {
    let matchFound = false;
    for (const coord1 of multiPoint1.coordinates) {
      if (compareCoords(coord2, coord1)) {
        matchFound = true;
        break;
      }
    }
    if (!matchFound) {
      return false;
    }
  }
  return true;
}

function isMultiPointOnLine(lineString: LineString, multiPoint: MultiPoint) {
  let haveFoundInteriorPoint = false;
  for (const coord of multiPoint.coordinates) {
    // Membership check first so points not on the line exit early
    if (!isPointOnLine(coord, lineString)) {
      return false;
    }
    // Only probe for an interior point until one has been found
    if (
      !haveFoundInteriorPoint &&
      isPointOnLine(coord, lineString, { ignoreEndVertices: true })
    ) {
      haveFoundInteriorPoint = true;
    }
  }
  return haveFoundInteriorPoint;
}

function isMultiPointInPoly(polygon: Polygon, multiPoint: MultiPoint) {
  let oneInside = false;
  for (const coord of multiPoint.coordinates) {
    // All points must be inside polygon (boundary OK)
    if (!booleanPointInPolygon(coord, polygon)) {
      return false;
    }
    // Track if at least one point is strictly in the interior
    if (!oneInside) {
      oneInside = booleanPointInPolygon(coord, polygon, {
        ignoreBoundary: true,
      });
    }
  }
  // At least one point must be in the interior (not just on boundary)
  return oneInside;
}

/**
 * How a point relates to a LineString, given the line's raw coordinates.
 * Replicates booleanPointOnLine's segment math (including the zero-length
 * segment special case) without its per-call input validation, so callers
 * can classify many points against the same line cheaply. A single scan
 * answers both membership and interiority, where interiority matches
 * booleanPointOnLine's ignoreEndVertices option: on the line anywhere but
 * solely at its start or end vertex.
 *
 * @private
 * @param {Position} pt point [x,y]
 * @param {Position[]} coords LineString coordinates
 * @returns {0|1|2} 0 = not on the line, 1 = only on the line's start or end vertex, 2 = on the line's interior
 */
function pointOnLineStatus(pt: Position, coords: Position[]): 0 | 1 | 2 {
  const x = pt[0];
  const y = pt[1];
  const last = coords.length - 2;
  let onLine = false;
  for (let i = 0; i <= last; i++) {
    const x1 = coords[i][0];
    const y1 = coords[i][1];
    const x2 = coords[i + 1][0];
    const y2 = coords[i + 1][1];
    const dxl = x2 - x1;
    const dyl = y2 - y1;
    if ((x - x1) * dyl - (y - y1) * dxl !== 0) {
      continue;
    }
    if (dxl === 0 && dyl === 0) {
      // Zero length segment: only its start (== end) vertex is on it, and
      // that point counts as interior unless it is also the line's boundary
      if (x === x1 && y === y1) {
        onLine = true;
        if (i !== 0 && i !== last) {
          return 2;
        }
      }
      continue;
    }
    const within =
      Math.abs(dxl) >= Math.abs(dyl)
        ? dxl > 0
          ? x1 <= x && x <= x2
          : x2 <= x && x <= x1
        : dyl > 0
          ? y1 <= y && y <= y2
          : y2 <= y && y <= y1;
    if (!within) {
      continue;
    }
    onLine = true;
    const atLineStart = i === 0 && x === coords[0][0] && y === coords[0][1];
    const atLineEnd =
      i === last && x === coords[last + 1][0] && y === coords[last + 1][1];
    if (!atLineStart && !atLineEnd) {
      return 2;
    }
  }
  return onLine ? 1 : 0;
}

function isLineOnLine(lineString1: LineString, lineString2: LineString) {
  let haveFoundInteriorPoint = false;
  const coords1 = lineString1.coordinates;
  const coordinates = lineString2.coordinates;
  for (let i = 0; i < coordinates.length; i++) {
    const coords = coordinates[i];
    const status = pointOnLineStatus(coords, coords1);
    // Membership check first so vertices not on the line exit early
    if (status === 0) {
      return false;
    }
    if (status === 2) {
      haveFoundInteriorPoint = true;
    } else if (!haveFoundInteriorPoint && i > 0) {
      // A segment whose endpoints are both on lineString1 (e.g. lineString2's
      // vertices coincide with lineString1's boundary) still shares interior
      // with lineString1. Probe the segment midpoint so an interior overlap
      // is detected even when no vertex of lineString2 is strictly interior.
      const midpoint: Position = [
        (coordinates[i - 1][0] + coords[0]) / 2,
        (coordinates[i - 1][1] + coords[1]) / 2,
      ];
      if (pointOnLineStatus(midpoint, coords1) === 2) {
        haveFoundInteriorPoint = true;
      }
    }
  }
  return haveFoundInteriorPoint;
}

function splitLineIntoSegmentsOnPolygon(
  linestring: LineString,
  polygon: Polygon
) {
  const coords = linestring.coordinates;

  const outputSegments: Feature<LineString>[] = [];

  for (let i = 0; i < coords.length - 1; i++) {
    const seg = lineString([coords[i], coords[i + 1]]);
    const split = lineSplit(seg, feature(polygon));

    if (split.features.length === 0) {
      outputSegments.push(seg);
    } else {
      outputSegments.push(...split.features);
    }
  }

  return featureCollection(outputSegments);
}

function isLineInPoly(polygon: Polygon, linestring: LineString) {
  return lineInPolyStatus(polygon, linestring) === "interior";
}

/**
 * Determines how a LineString relates to a Polygon:
 * - "outside" if any part of the line lies in the polygon's exterior
 * - "interior" if no part lies in the exterior and at least one segment lies in the interior
 * - "boundary" if the entire line lies on the polygon's boundary
 *
 * @private
 * @param {Polygon} polygon Polygon geometry
 * @param {LineString} linestring LineString geometry
 * @returns {"outside"|"boundary"|"interior"} the line's relation to the polygon
 */
function lineInPolyStatus(
  polygon: Polygon,
  linestring: LineString
): "outside" | "boundary" | "interior" {
  const polyBbox = calcBbox(polygon);
  const lineBbox = calcBbox(linestring);

  if (!doBBoxOverlap(polyBbox, lineBbox)) {
    return "outside";
  }

  for (const coord of linestring.coordinates) {
    if (!booleanPointInPolygon(coord, polygon)) {
      return "outside";
    }
  }

  let hasInteriorSegment = false;
  // split intersecting segments and verify their inclusion
  const lineSegments = splitLineIntoSegmentsOnPolygon(linestring, polygon);

  for (const lineSegment of lineSegments.features) {
    const midpoint = getMidpoint(
      lineSegment.geometry.coordinates[0],
      lineSegment.geometry.coordinates[1]
    );

    // make sure all segments do not intersect with polygon exterior
    if (!booleanPointInPolygon(midpoint, polygon)) {
      return "outside";
    }

    // track whether at least 1 segment intersects with the polygon's interior
    if (
      !hasInteriorSegment &&
      booleanPointInPolygon(midpoint, polygon, { ignoreBoundary: true })
    ) {
      hasInteriorSegment = true;
    }
  }

  return hasInteriorSegment ? "interior" : "boundary";
}

/**
 * Is Polygon2 in Polygon1
 * Only takes into account outer rings
 *
 * @private
 * @param {Geometry|Feature<Polygon>} feature1 Polygon1
 * @param {Geometry|Feature<Polygon>} feature2 Polygon2
 * @returns {boolean} true/false
 */
function isPolyInPoly(
  feature1: Feature<Polygon> | Polygon,
  feature2: Feature<Polygon> | Polygon,
  feature2Bbox?: BBox
) {
  // Handle Nulls
  if (feature1.type === "Feature" && feature1.geometry === null) {
    return false;
  }
  if (feature2.type === "Feature" && feature2.geometry === null) {
    return false;
  }

  const poly1Bbox = calcBbox(feature1);
  const poly2Bbox = feature2Bbox ?? calcBbox(feature2);
  if (!doBBoxOverlap(poly1Bbox, poly2Bbox)) {
    return false;
  }

  const coords = getGeom(feature2).coordinates;
  for (const ring of coords) {
    for (const coord of ring) {
      if (!booleanPointInPolygon(coord, feature1)) {
        return false;
      }
    }
  }
  return true;
}

function doBBoxOverlap(bbox1: BBox, bbox2: BBox) {
  if (bbox1[0] > bbox2[0]) {
    return false;
  }
  if (bbox1[2] < bbox2[2]) {
    return false;
  }
  if (bbox1[1] > bbox2[1]) {
    return false;
  }
  if (bbox1[3] < bbox2[3]) {
    return false;
  }
  return true;
}

/**
 * compareCoords
 *
 * @private
 * @param {Position} pair1 point [x,y]
 * @param {Position} pair2 point [x,y]
 * @returns {boolean} true/false if coord pairs match
 */
function compareCoords(pair1: number[], pair2: number[]) {
  return pair1[0] === pair2[0] && pair1[1] === pair2[1];
}

function getMidpoint(pair1: number[], pair2: number[]) {
  return [(pair1[0] + pair2[0]) / 2, (pair1[1] + pair2[1]) / 2];
}

export {
  booleanContains,
  isPolygonInMultiPolygon,
  isPointInMultiPoint,
  isMultiPointInMultiPoint,
  isMultiPointOnLine,
  isMultiPointInPoly,
  isLineOnLine,
  isLineInPoly,
  isPolyInPoly,
  isMultiPolyInPoly,
  doBBoxOverlap,
  compareCoords,
  getMidpoint,
};

export default booleanContains;
