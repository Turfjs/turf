import { Feature, Point, Position, LineString, MultiLineString } from "geojson";
import { distance } from "@turf/distance";
import { flattenEach } from "@turf/meta";
import {
  point,
  degreesToRadians,
  radiansToDegrees,
  Coord,
  Units,
} from "@turf/helpers";
import { getCoord, getCoords } from "@turf/invariant";

/**
 * Returns the nearest point on a line to a given point.
 *
 * @function
 * @param {Geometry|Feature<LineString|MultiLineString>} lines lines to snap to
 * @param {Geometry|Feature<Point>|number[]} pt point to snap from
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}
 * @returns {Feature<Point>} closest point on the `line` to `point`. The properties object will contain four values: `index`: closest point was found on nth line part, `multiFeatureIndex`: closest point was found on the nth line of the `MultiLineString`, `dist`: distance between pt and the closest point, `location`: distance along the line between start and the closest point.
 * @example
 * var line = turf.lineString([
 *     [-77.031669, 38.878605],
 *     [-77.029609, 38.881946],
 *     [-77.020339, 38.884084],
 *     [-77.025661, 38.885821],
 *     [-77.021884, 38.889563],
 *     [-77.019824, 38.892368]
 * ]);
 * var pt = turf.point([-77.037076, 38.884017]);
 *
 * var snapped = turf.nearestPointOnLine(line, pt, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [line, pt, snapped];
 * snapped.properties['marker-color'] = '#00f';
 */
function nearestPointOnLine<G extends LineString | MultiLineString>(
  lines: Feature<G> | G,
  pt: Coord,
  options: { units?: Units } = {}
): Feature<
  Point,
  {
    dist: number;
    index: number;
    multiFeatureIndex: number;
    location: number;
    [key: string]: any;
  }
> {
  if (!lines || !pt) {
    throw new Error("lines and pt are required arguments");
  }

  const ptPos = getCoord(pt);

  let closestPt: Feature<
    Point,
    { dist: number; index: number; multiFeatureIndex: number; location: number }
  > = point([Infinity, Infinity], {
    dist: Infinity,
    index: -1,
    multiFeatureIndex: -1,
    location: -1,
  });

  let length = 0.0;
  flattenEach(
    lines,
    function (line: any, _featureIndex: number, multiFeatureIndex: number) {
      const coords: any = getCoords(line);

      for (let i = 0; i < coords.length - 1; i++) {
        //start - start of current line section
        const start: Feature<Point, { dist: number }> = point(coords[i]);
        const startPos = getCoord(start);

        //stop - end of current line section
        const stop: Feature<Point, { dist: number }> = point(coords[i + 1]);
        const stopPos = getCoord(stop);

        // sectionLength
        const sectionLength = distance(start, stop, options);
        let intersectPos: Position;
        let wasEnd: boolean;

        // Short circuit if snap point is start or end position of the line
        // Test the end position first for consistency in case they are
        // coincident
        if (stopPos[0] === ptPos[0] && stopPos[1] === ptPos[1]) {
          [intersectPos, wasEnd] = [stopPos, true];
        } else if (startPos[0] === ptPos[0] && startPos[1] === ptPos[1]) {
          [intersectPos, wasEnd] = [startPos, false];
        } else {
          // Otherwise, find the nearest point the hard way.
          [intersectPos, wasEnd] = nearestPointOnSegment(
            startPos,
            stopPos,
            ptPos
          );
        }

        const intersectPt = point(intersectPos, {
          dist: distance(pt, intersectPos, options),
          multiFeatureIndex: multiFeatureIndex,
          location: length + distance(start, intersectPos, options),
        });

        if (intersectPt.properties.dist < closestPt.properties.dist) {
          closestPt = {
            ...intersectPt,
            properties: {
              ...intersectPt.properties,
              // Legacy behaviour where index progresses to next segment # if we
              // went with the end point this iteration.
              index: wasEnd ? i + 1 : i,
            },
          };
        }

        // update length
        length += sectionLength;
      }
    }
  );

  return closestPt;
}

/*
 * Plan is to externalise these vector functions to a simple third party
 * library.
 * Possible candidate is @amandaghassaei/vector-math though having some import
 * issues.
 */
type Vector = [number, number, number];

function dot(v1: Vector, v2: Vector): number {
  const [v1x, v1y, v1z] = v1;
  const [v2x, v2y, v2z] = v2;
  return v1x * v2x + v1y * v2y + v1z * v2z;
}

// https://en.wikipedia.org/wiki/Cross_product
function cross(v1: Vector, v2: Vector): Vector {
  const [v1x, v1y, v1z] = v1;
  const [v2x, v2y, v2z] = v2;
  return [v1y * v2z - v1z * v2y, v1z * v2x - v1x * v2z, v1x * v2y - v1y * v2x];
}

function magnitude(v: Vector): number {
  return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2));
}

function normalize(v: Vector): Vector {
  const mag = magnitude(v);
  return [v[0] / mag, v[1] / mag, v[2] / mag];
}

function angle(v1: Vector, v2: Vector): number {
  const theta = dot(v1, v2) / (magnitude(v1) * magnitude(v2));
  return Math.acos(Math.min(Math.max(theta, -1), 1));
}

function lngLatToVector(a: Position): Vector {
  const lat = degreesToRadians(a[1]);
  const lng = degreesToRadians(a[0]);
  return [
    Math.cos(lat) * Math.cos(lng),
    Math.cos(lat) * Math.sin(lng),
    Math.sin(lat),
  ];
}

function vectorToLngLat(v: Vector): Position {
  const [x, y, z] = v;
  // Clamp the z-value to ensure that is inside the [-1, 1] domain as required
  // by asin. Note that
  const zClamp = Math.min(Math.max(z, -1), 1);
  const lat = radiansToDegrees(Math.asin(zClamp));
  const lng = radiansToDegrees(Math.atan2(y, x));

  return [lng, lat];
}

function nearestPointOnSegment(
  posA: Position, // start point of segment to measure to
  posB: Position, // end point of segment to measure to
  posC: Position // point to measure from
): [Position, boolean] {
  // Based heavily on this article on finding cross track distance to an arc:
  // https://gis.stackexchange.com/questions/209540/projecting-cross-track-distance-on-great-circle

  // Convert spherical (lng, lat) to cartesian vector coords (x, y, z)
  // In the below https://tikz.net/spherical_1/ we convert lng (𝜙) and lat (𝜃)
  // into vectors with x, y, and z components with a length (r) of 1.
  const A = lngLatToVector(posA); // the vector from 0,0,0 to posA
  const B = lngLatToVector(posB); // ... to posB
  const C = lngLatToVector(posC); // ... to posC

  // The axis (normal vector) of the great circle plane containing the line segment
  const segmentAxis = cross(A, B);

  // Two degenerate cases exist for the segment axis cross product. The first is
  // when vectors are aligned (within the bounds of floating point tolerance).
  // The second is where vectors are antipodal (again within the bounds of
  // tolerance. Both cases produce a [0, 0, 0] cross product which invalidates
  // the rest of the algorithm, but each case must be handled separately:
  // - The aligned case indicates coincidence of A and B. therefore this can be
  //   an early return assuming the closest point is the end (for consistency).
  // - The antipodal case is truly degenerate - an infinte number of great
  //   circles are possible and one will always pass through C. We assume this
  //   is undefined behavior and therefore throw. Callers can catch this and
  //   return 0 if they wish.
  if (segmentAxis[0] === 0 && segmentAxis[1] === 0 && segmentAxis[2] === 0) {
    if (dot(A, B) > 0) {
      return [[...posB], true];
    } else {
      throw new Error(
        `Undefined arc segment, line segment endpoints [[${posA}], [${posB}]] are antipodes`
      );
    }
  }

  // The axis of the great circle passing through the segment's axis and the
  // target point
  const targetAxis = cross(segmentAxis, C);

  // This cross product also has a degenerate case where the segment axis is
  // coincident with or antipodal to the target point. In this case the point
  // is equidistant to the entire segment. For consistency, we early return the
  // endpoint as the matching point.
  if (targetAxis[0] === 0 && targetAxis[1] === 0 && targetAxis[2] === 0) {
    return [[...posB], true];
  }

  // The line of intersection between the two great circle planes
  const intersectionAxis = cross(targetAxis, segmentAxis);

  // Vectors to the two points these great circles intersect are the normalized
  // intersection and its antipodes
  const I1 = normalize(intersectionAxis);
  const I2: Vector = [-I1[0], -I1[1], -I1[2]];

  // Figure out which is the closest intersection to this segment of the great circle
  // Note that for points on a unit sphere, the dot product represents the
  // cosine of the angle between the two vectors which monotonically increases
  // the closer the two points are together and therefore determines proximity
  const I = dot(C, I1) > dot(C, I2) ? I1 : I2;

  // I is the closest intersection to the segment, though might not actually be
  // ON the segment.

  // If angle AI or BI is greater than angleAB, I lies on the circle *beyond* A
  // and B so use the closest of A or B as the intersection
  const angleAB = angle(A, B);
  const lngLatI = vectorToLngLat(I);

  if (angle(A, I) > angleAB || angle(B, I) > angleAB) {
    // Similar to the usage above, we use the larger dot product to determine
    // which endpoint is closer to the test coordinates
    // Note that the > means we defer to the endpoint when equidistant,
    // following the segment tracking logic in the caller
    if (dot(A, C) > dot(B, C)) {
      // Clone position when returning as it is reasonable to not expect structural
      // sharing on the returned Position in all return cases
      return [[...posA], false];
    } else {
      return [[...posB], true];
    }
  }

  // As angleAI nor angleBI don't exceed angleAB, I is on the segment
  return [lngLatI, false];
}

export { nearestPointOnLine };
export default nearestPointOnLine;
