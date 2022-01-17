import { Feature, Geometry, LineString, Point, Polygon } from "geojson";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import lineIntersect from "@turf/line-intersect";
import { flattenEach } from "@turf/meta";
import polygonToLine from "@turf/polygon-to-line";

/**
 * Boolean-disjoint returns (TRUE) if the intersection of the two geometries is an empty set.
 *
 * @name booleanDisjoint
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var point = turf.point([2, 2]);
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 *
 * turf.booleanDisjoint(line, point);
 * //=true
 */
function booleanDisjoint(
  feature1: Feature<any> | Geometry,
  feature2: Feature<any> | Geometry
): boolean {
  let bool = true;
  flattenEach(feature1, (flatten1) => {
    flattenEach(feature2, (flatten2) => {
      if (bool === false) {
        return false;
      }
      bool = disjoint(flatten1.geometry, flatten2.geometry);
    });
  });
  return bool;
}

/**
 * Disjoint operation for simple Geometries (Point/LineString/Polygon)
 *
 * @private
 * @param {Geometry<any>} geom1 GeoJSON Geometry
 * @param {Geometry<any>} geom2 GeoJSON Geometry
 * @returns {boolean} true/false
 */
function disjoint(geom1: any, geom2: any) {
  switch (geom1.type) {
    case "Point":
      switch (geom2.type) {
        case "Point":
          return !compareCoords(geom1.coordinates, geom2.coordinates);
        case "LineString":
          return !isPointOnLine(geom2, geom1);
        case "Polygon":
          return !booleanPointInPolygon(geom1, geom2);
      }
      /* istanbul ignore next */
      break;
    case "LineString":
      switch (geom2.type) {
        case "Point":
          return !isPointOnLine(geom1, geom2);
        case "LineString":
          return !isLineOnLine(geom1, geom2);
        case "Polygon":
          return !isLineInPoly(geom2, geom1);
      }
      /* istanbul ignore next */
      break;
    case "Polygon":
      switch (geom2.type) {
        case "Point":
          return !booleanPointInPolygon(geom2, geom1);
        case "LineString":
          return !isLineInPoly(geom1, geom2);
        case "Polygon":
          return !isPolyInPoly(geom2, geom1);
      }
  }
  return false;
}

// http://stackoverflow.com/a/11908158/1979085
function isPointOnLine(lineString: LineString, pt: Point) {
  for (let i = 0; i < lineString.coordinates.length - 1; i++) {
    if (
      isPointOnLineSegment(
        lineString.coordinates[i],
        lineString.coordinates[i + 1],
        pt.coordinates
      )
    ) {
      return true;
    }
  }
  return false;
}

function isLineOnLine(lineString1: LineString, lineString2: LineString) {
  const doLinesIntersect = lineIntersect(lineString1, lineString2);
  if (doLinesIntersect.features.length > 0) {
    return true;
  }
  return false;
}

function isLineInPoly(polygon: Polygon, lineString: LineString) {
  for (const coord of lineString.coordinates) {
    if (booleanPointInPolygon(coord, polygon)) {
      return true;
    }
  }
  const doLinesIntersect = lineIntersect(lineString, polygonToLine(polygon));
  if (doLinesIntersect.features.length > 0) {
    return true;
  }
  return false;
}

/**
 * Is Polygon (geom1) in Polygon (geom2)
 * Only takes into account outer rings
 * See http://stackoverflow.com/a/4833823/1979085
 *
 * @private
 * @param {Geometry|Feature<Polygon>} feature1 Polygon1
 * @param {Geometry|Feature<Polygon>} feature2 Polygon2
 * @returns {boolean} true/false
 */
function isPolyInPoly(feature1: Polygon, feature2: Polygon) {
  for (const coord1 of feature1.coordinates[0]) {
    if (booleanPointInPolygon(coord1, feature2)) {
      return true;
    }
  }
  for (const coord2 of feature2.coordinates[0]) {
    if (booleanPointInPolygon(coord2, feature1)) {
      return true;
    }
  }
  const doLinesIntersect = lineIntersect(
    polygonToLine(feature1),
    polygonToLine(feature2)
  );
  if (doLinesIntersect.features.length > 0) {
    return true;
  }
  return false;
}

function isPointOnLineSegment(
  lineSegmentStart: number[],
  lineSegmentEnd: number[],
  pt: number[]
) {
  const dxc = pt[0] - lineSegmentStart[0];
  const dyc = pt[1] - lineSegmentStart[1];
  const dxl = lineSegmentEnd[0] - lineSegmentStart[0];
  const dyl = lineSegmentEnd[1] - lineSegmentStart[1];
  const cross = dxc * dyl - dyc * dxl;
  if (cross !== 0) {
    return false;
  }
  if (Math.abs(dxl) >= Math.abs(dyl)) {
    if (dxl > 0) {
      return lineSegmentStart[0] <= pt[0] && pt[0] <= lineSegmentEnd[0];
    } else {
      return lineSegmentEnd[0] <= pt[0] && pt[0] <= lineSegmentStart[0];
    }
  } else if (dyl > 0) {
    return lineSegmentStart[1] <= pt[1] && pt[1] <= lineSegmentEnd[1];
  } else {
    return lineSegmentEnd[1] <= pt[1] && pt[1] <= lineSegmentStart[1];
  }
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

export default booleanDisjoint;
