import {
  BBox,
  Feature,
  Geometry,
  LineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";
import { bbox as calcBbox } from "@turf/bbox";
import { booleanPointOnLine } from "@turf/boolean-point-on-line";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { getGeom } from "@turf/invariant";
import { feature, featureCollection, lineString } from "@turf/helpers";
import { lineSplit } from "@turf/line-split";

/**
 * Tests whether geometry a is contained by geometry b.
 * The interiors of both geometries must intersect, and the interior and boundary of geometry a must not intersect the exterior of geometry b.
 * booleanWithin(a, b) is equivalent to booleanContains(b, a)
 *
 * @function
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 * var point = turf.point([1, 2]);
 *
 * turf.booleanWithin(point, line);
 * //=true
 */
function booleanWithin(
  feature1: Feature<any> | Geometry,
  feature2: Feature<any> | Geometry
): boolean {
  var geom1 = getGeom(feature1);
  var geom2 = getGeom(feature2);
  var type1 = geom1.type;
  var type2 = geom2.type;

  switch (type1) {
    case "Point":
      switch (type2) {
        case "MultiPoint":
          return isPointInMultiPoint(geom1, geom2);
        case "LineString":
          return booleanPointOnLine(geom1, geom2, { ignoreEndVertices: true });
        case "Polygon":
        case "MultiPolygon":
          return booleanPointInPolygon(geom1, geom2, { ignoreBoundary: true });
        default:
          throw new Error("feature2 " + type2 + " geometry not supported");
      }
    case "MultiPoint":
      switch (type2) {
        case "MultiPoint":
          return isMultiPointInMultiPoint(geom1, geom2);
        case "LineString":
          return isMultiPointOnLine(geom1, geom2);
        case "Polygon":
        case "MultiPolygon":
          return isMultiPointInPoly(geom1, geom2);
        default:
          throw new Error("feature2 " + type2 + " geometry not supported");
      }
    case "LineString":
      switch (type2) {
        case "LineString":
          return isLineOnLine(geom1, geom2);
        case "Polygon":
        case "MultiPolygon":
          return isLineInPoly(geom1, geom2);
        default:
          throw new Error("feature2 " + type2 + " geometry not supported");
      }
    case "Polygon":
      switch (type2) {
        case "Polygon":
        case "MultiPolygon":
          return isPolyInPoly(geom1, geom2);
        default:
          throw new Error("feature2 " + type2 + " geometry not supported");
      }
    default:
      throw new Error("feature1 " + type1 + " geometry not supported");
  }
}

function isPointInMultiPoint(point: Point, multiPoint: MultiPoint) {
  var i;
  var output = false;
  for (i = 0; i < multiPoint.coordinates.length; i++) {
    if (compareCoords(multiPoint.coordinates[i], point.coordinates)) {
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
  for (var i = 0; i < multiPoint1.coordinates.length; i++) {
    var anyMatch = false;
    for (var i2 = 0; i2 < multiPoint2.coordinates.length; i2++) {
      if (
        compareCoords(multiPoint1.coordinates[i], multiPoint2.coordinates[i2])
      ) {
        anyMatch = true;
      }
    }
    if (!anyMatch) {
      return false;
    }
  }
  return true;
}

function isMultiPointOnLine(multiPoint: MultiPoint, lineString: LineString) {
  var foundInsidePoint = false;

  for (var i = 0; i < multiPoint.coordinates.length; i++) {
    if (!booleanPointOnLine(multiPoint.coordinates[i], lineString)) {
      return false;
    }
    if (!foundInsidePoint) {
      foundInsidePoint = booleanPointOnLine(
        multiPoint.coordinates[i],
        lineString,
        { ignoreEndVertices: true }
      );
    }
  }
  return foundInsidePoint;
}

function isMultiPointInPoly(multiPoint: MultiPoint, polygon: Polygon) {
  var output = true;
  var oneInside = false;
  var isInside = false;
  for (var i = 0; i < multiPoint.coordinates.length; i++) {
    isInside = booleanPointInPolygon(multiPoint.coordinates[i], polygon);
    if (!isInside) {
      output = false;
      break;
    }
    if (!oneInside) {
      isInside = booleanPointInPolygon(multiPoint.coordinates[i], polygon, {
        ignoreBoundary: true,
      });
    }
  }
  return output && isInside;
}

function isLineOnLine(lineString1: LineString, lineString2: LineString) {
  for (var i = 0; i < lineString1.coordinates.length; i++) {
    if (!booleanPointOnLine(lineString1.coordinates[i], lineString2)) {
      return false;
    }
  }
  return true;
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

function isLineInPoly(linestring: LineString, polygon: Polygon) {
  const polyBbox = calcBbox(polygon);
  const lineBbox = calcBbox(linestring);

  if (!doBBoxOverlap(polyBbox, lineBbox)) {
    return false;
  }

  for (const coord of linestring.coordinates) {
    if (!booleanPointInPolygon(coord, polygon)) {
      return false;
    }
  }

  let isContainedByPolygonBoundary = false;
  // split intersecting segments and verify their inclusion
  const lineSegments = splitLineIntoSegmentsOnPolygon(linestring, polygon);

  for (const lineSegment of lineSegments.features) {
    const midpoint = getMidpoint(
      lineSegment.geometry.coordinates[0],
      lineSegment.geometry.coordinates[1]
    );

    // make sure all segments do not intersect with polygon exterior
    if (!booleanPointInPolygon(midpoint, polygon)) {
      return false;
    }

    // make sure at least 1 segment intersects with the polygon's interior
    if (
      !isContainedByPolygonBoundary &&
      booleanPointInPolygon(midpoint, polygon, { ignoreBoundary: true })
    ) {
      isContainedByPolygonBoundary = true;
    }
  }

  return isContainedByPolygonBoundary;
}

/**
 * Is Polygon2 in Polygon1
 * Only takes into account outer rings
 *
 * @private
 * @param {Polygon} geometry1
 * @param {Polygon|MultiPolygon} geometry2
 * @returns {boolean} true/false
 */
function isPolyInPoly(geometry1: Polygon, geometry2: Polygon | MultiPolygon) {
  var poly1Bbox = calcBbox(geometry1);
  var poly2Bbox = calcBbox(geometry2);
  if (!doBBoxOverlap(poly2Bbox, poly1Bbox)) {
    return false;
  }
  for (var i = 0; i < geometry1.coordinates[0].length; i++) {
    if (!booleanPointInPolygon(geometry1.coordinates[0][i], geometry2)) {
      return false;
    }
  }
  return true;
}

function doBBoxOverlap(bbox1: BBox, bbox2: BBox) {
  if (bbox1[0] > bbox2[0]) return false;
  if (bbox1[2] < bbox2[2]) return false;
  if (bbox1[1] > bbox2[1]) return false;
  if (bbox1[3] < bbox2[3]) return false;
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

/**
 * getMidpoint
 *
 * @private
 * @param {Position} pair1 point [x,y]
 * @param {Position} pair2 point [x,y]
 * @returns {Position} midpoint of pair1 and pair2
 */
function getMidpoint(pair1: number[], pair2: number[]) {
  return [(pair1[0] + pair2[0]) / 2, (pair1[1] + pair2[1]) / 2];
}

export { booleanWithin };
export default booleanWithin;
