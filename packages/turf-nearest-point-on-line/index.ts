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
 * If any of the segments in the input line string are antipodal and therefore
 * have an undefined arc, this function will instead return that the point lies
 * on the line.
 *
 * ⚠️ We have begun the process of migrating to different return properties for
 * this function. The new properties we recommend using as of v7.4 are:
 * - lineStringIndex - point was found on the nth LineString of an input MultiLineString. Previously `multiFeatureIndex`
 * - segmentIndex - point was found on the nth segment of the above LineString. Previously `index`
 * - totalDistance - distance from the start of the overall MultiLineString. Previously `location`
 * - lineDistance - distance from the start of the relevant LineString
 * - segmentDistance - distance from the start of the relevant segment
 * - pointDistance - distance between found point is from input reference point. Previously `dist`
 *
 * multiFeatureIndex, index, location, and dist continue to work as previously
 * until at least the next major release.
 *
 * @function
 * @param {Geometry|Feature<LineString|MultiLineString>} lines Lines to snap to
 * @param {Geometry|Feature<Point>|number[]} inputPoint Point to snap from
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}
 * @returns {Feature<Point>} closest point on the `lines` to the `inputPoint`. The point will have the following properties: `lineStringIndex`: closest point was found on the nth LineString (only relevant if input is MultiLineString), `segmentIndex`: closest point was found on nth line segment of the LineString, `totalDistance`: distance along the line from the absolute start of the MultiLineString, `lineDistance`: distance along the line from the start of the LineString where the closest point was found, `segmentDistance`: distance along the line from the start of the line segment where the closest point was found, `pointDistance`: distance to the input point.
 * @example
 * var line = turf.lineString([
 *     [-77.031669, 38.878605],
 *     [-77.029609, 38.881946],
 *     [-77.020339, 38.884084],
 *     [-77.025661, 38.885821],
 *     [-77.021884, 38.889563],
 *     [-77.019824, 38.892368]
 * ]);
 * var inputPoint = turf.point([-77.037076, 38.884017]);
 *
 * var snapped = turf.nearestPointOnLine(line, inputPoint, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [line, inputPoint, snapped];
 * snapped.properties['marker-color'] = '#00f';
 */
function nearestPointOnLine<G extends LineString | MultiLineString>(
  lines: Feature<G> | G,
  inputPoint: Coord,
  options: { units?: Units } = {}
): Feature<
  Point,
  {
    lineStringIndex: number;
    segmentIndex: number;
    totalDistance: number;
    lineDistance: number;
    segmentDistance: number;
    pointDistance: number;
    // deprecated properties START
    /** @deprecated use `lineStringIndex` instead */
    multiFeatureIndex: number;
    /** @deprecated use `segmentIndex` instead */
    index: number;
    /** @deprecated use `totalDistance` instead */
    location: number;
    /** @deprecated use `pointDistance` instead */
    dist: number;
    // deprecated properties END
    [key: string]: any;
  }
> {
  if (!lines || !inputPoint) {
    throw new Error("lines and inputPoint are required arguments");
  }

  const inputPos = getCoord(inputPoint);

  let closestPt = point([Infinity, Infinity], {
    lineStringIndex: -1,
    segmentIndex: -1,
    totalDistance: -1,
    lineDistance: -1,
    segmentDistance: -1,
    pointDistance: Infinity,
    // deprecated properties START
    multiFeatureIndex: -1,
    index: -1,
    location: -1,
    dist: Infinity,
    // deprecated properties END
  });

  let totalDistance = 0.0;
  let lineDistance = 0.0;
  let currentLineStringIndex = -1;
  flattenEach(
    lines,
    function (line: any, _featureIndex: number, lineStringIndex: number) {
      //reset lineDistance at each changed lineStringIndex
      if (currentLineStringIndex !== lineStringIndex) {
        currentLineStringIndex = lineStringIndex;
        lineDistance = 0.0;
      }

      const coords: any = getCoords(line);
      const maxSegmentIndex = coords.length - 2;

      for (let i = 0; i < coords.length - 1; i++) {
        //start - start of current line section
        const start: Feature<Point, { dist: number }> = point(coords[i]);
        const startPos = getCoord(start);

        //stop - end of current line section
        const stop: Feature<Point, { dist: number }> = point(coords[i + 1]);
        const stopPos = getCoord(stop);

        // segmentLength
        const segmentLength = distance(start, stop, options);
        let intersectPos: Position;
        let wasEnd: boolean;

        // Short circuit if snap point is start or end position of the line
        // Test the end position first for consistency in case they are
        // coincident
        if (stopPos[0] === inputPos[0] && stopPos[1] === inputPos[1]) {
          [intersectPos, wasEnd] = [stopPos, true];
        } else if (startPos[0] === inputPos[0] && startPos[1] === inputPos[1]) {
          [intersectPos, wasEnd] = [startPos, false];
        } else {
          // Otherwise, find the nearest point the hard way.
          [intersectPos, wasEnd] = nearestPointOnSegment(
            startPos,
            stopPos,
            inputPos
          );
        }

        const pointDistance = distance(inputPoint, intersectPos, options);

        if (pointDistance < closestPt.properties.pointDistance) {
          const segmentDistance = distance(start, intersectPos, options);
          closestPt = point(intersectPos, {
            lineStringIndex: lineStringIndex,
            // Legacy behaviour where index progresses to next segment if we
            // went with the end point this iteration. Though make sure we
            // only progress to the beginning of the next segment if one
            // actually exists.
            segmentIndex: wasEnd && i + 1 <= maxSegmentIndex ? i + 1 : i,
            totalDistance: totalDistance + segmentDistance,
            lineDistance: lineDistance + segmentDistance,
            segmentDistance: segmentDistance,
            pointDistance: pointDistance,
            // deprecated properties START
            multiFeatureIndex: -1,
            index: -1,
            location: -1,
            dist: Infinity,
            // deprecated properties END
          });
          closestPt.properties = {
            ...closestPt.properties,
            multiFeatureIndex: closestPt.properties.lineStringIndex,
            index: closestPt.properties.segmentIndex,
            location: closestPt.properties.totalDistance,
            dist: closestPt.properties.pointDistance,
            // deprecated properties END
          };
        }

        // update totalDistance and lineDistance
        totalDistance += segmentLength;
        lineDistance += segmentLength;
      }
    }
  );

  return closestPt;
}

// A simple Vector3 type for cartesian operations.
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
  // by asin. Note therefore that this function should only be applied to unit
  // vectors so z > 1 should not exist
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
  //   circles are possible and one will always pass through C. However, given
  //   that this case is both highly unlikely to occur in practice and that is
  //   will usually be logically sound to return that the point is on the
  //   segment, we choose to return the provided point.
  if (segmentAxis[0] === 0 && segmentAxis[1] === 0 && segmentAxis[2] === 0) {
    if (dot(A, B) > 0) {
      return [[...posB], true];
    } else {
      return [[...posC], false];
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
  // ON the segment. To test whether the closest intersection lies on the arc or
  // not, we do a cross product comparison to check rotation around the unit
  // circle defined by the great circle plane.
  const segmentAxisNorm = normalize(segmentAxis);
  const cmpAI = dot(cross(A, I), segmentAxisNorm);
  const cmpIB = dot(cross(I, B), segmentAxisNorm);

  // When both comparisons are positive, the rotation from A to I to B is in the
  // same direction, implying that I lies between A and B
  if (cmpAI >= 0 && cmpIB >= 0) {
    return [vectorToLngLat(I), false];
  }

  // Finally process the case where the intersection is not on the segment,
  // using the dot product with the original point to find the closest endpoint
  if (dot(A, C) > dot(B, C)) {
    // Clone position when returning as it is reasonable to not expect structural
    // sharing on the returned Position in all return cases
    return [[...posA], false];
  } else {
    return [[...posB], true];
  }
}

export { nearestPointOnLine };
export default nearestPointOnLine;
