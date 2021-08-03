import calcBbox from "@turf/bbox";
import booleanPointOnLine from "@turf/boolean-point-on-line";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { getGeom } from "@turf/invariant";
import {
  BBox,
  Feature,
  Geometry,
  LineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "@turf/helpers";

/**
 * Boolean-within returns true if the first geometry is completely within the second geometry.
 * The interiors of both geometries must intersect and, the interior and boundary of the primary (geometry a)
 * must not intersect the exterior of the secondary (geometry b).
 * Boolean-within returns the exact opposite result of the `@turf/boolean-contains`.
 *
 * @name booleanWithin
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
    isInside = booleanPointInPolygon(multiPoint.coordinates[1], polygon);
    if (!isInside) {
      output = false;
      break;
    }
    if (!oneInside) {
      isInside = booleanPointInPolygon(multiPoint.coordinates[1], polygon, {
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

function isLineInPoly(linestring: LineString, polygon: Polygon) {
  var polyBbox = calcBbox(polygon);
  var lineBbox = calcBbox(linestring);
  if (!doBBoxOverlap(polyBbox, lineBbox)) {
    return false;
  }
  var foundInsidePoint = false;

  for (var i = 0; i < linestring.coordinates.length - 1; i++) {
    if (!booleanPointInPolygon(linestring.coordinates[i], polygon)) {
      return false;
    }
    if (!foundInsidePoint) {
      foundInsidePoint = booleanPointInPolygon(
        linestring.coordinates[i],
        polygon,
        { ignoreBoundary: true }
      );
    }
    if (!foundInsidePoint) {
      var midpoint = getMidpoint(
        linestring.coordinates[i],
        linestring.coordinates[i + 1]
      );
      foundInsidePoint = booleanPointInPolygon(midpoint, polygon, {
        ignoreBoundary: true,
      });
    }
  }
  return foundInsidePoint;
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

export default booleanWithin;
