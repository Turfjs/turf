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
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @returns {Feature<Point>} closest point on the `line` to `point`. The properties object will contain four values: `index`: closest point was found on nth line part, `multiFeatureIndex`: closest point was found on the nth line of the `MultiLineString`, `dist`: distance between pt and the closest point, `location`: distance along the line between start and the closest point, `multiFeatureLocation`: distance along the line between start of the `MultiLineString` where closest point was found and the closest point.
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
    multiFeatureLocation: number;
    [key: string]: any;
  }
> {
  if (!lines || !pt) {
    throw new Error("lines and pt are required arguments");
  }

  const ptPos = getCoord(pt);

  let closestPt: Feature<
    Point,
    {
      dist: number;
      index: number;
      multiFeatureIndex: number;
      location: number;
      multiFeatureLocation: number;
    }
  > = point([Infinity, Infinity], {
    dist: Infinity,
    index: -1,
    multiFeatureIndex: -1,
    location: -1,
    multiFeatureLocation: -1,
  });

  let length = 0.0;
  let multiFeatureLength = 0.0;
  let currentMultiFeatureIndex = -1;
  flattenEach(
    lines,
    function (line: any, _featureIndex: number, multiFeatureIndex: number) {
      //reset multiFeatureLength at each changed multiFeatureIndex
      if (currentMultiFeatureIndex !== multiFeatureIndex) {
        currentMultiFeatureIndex = multiFeatureIndex;
        multiFeatureLength = 0.0;
      }

      const coords: any = getCoords(line);

      for (let i = 0; i < coords.length - 1; i++) {
        //start - start of current line section
        const start: Feature<Point, { dist: number }> = point(coords[i]);
        start.properties.dist = distance(pt, start, options);
        const startPos = getCoord(start);

        //stop - end of current line section
        const stop: Feature<Point, { dist: number }> = point(coords[i + 1]);
        stop.properties.dist = distance(pt, stop, options);
        const stopPos = getCoord(stop);

        // sectionLength
        const sectionLength = distance(start, stop, options);
        let intersectPos: Position;
        let wasEnd: boolean;

        // Short circuit if snap point is start or end position of the line
        // segment or if start is equal to stop position.
        if (startPos[0] === ptPos[0] && startPos[1] === ptPos[1]) {
          [intersectPos, , wasEnd] = [startPos, undefined, false];
        } else if (stopPos[0] === ptPos[0] && stopPos[1] === ptPos[1]) {
          [intersectPos, , wasEnd] = [stopPos, undefined, true];
        } else if (startPos[0] === stopPos[0] && startPos[1] === stopPos[1]) {
          [intersectPos, , wasEnd] = [stopPos, undefined, true];
        } else {
          // Otherwise, find the nearest point the hard way.
          [intersectPos, , wasEnd] = nearestPointOnSegment(
            start.geometry.coordinates,
            stop.geometry.coordinates,
            getCoord(pt)
          );
        }
        let intersectPt:
          | Feature<
              Point,
              {
                dist: number;
                multiFeatureIndex: number;
                location: number;
                multiFeatureLocation: number;
              }
            >
          | undefined;

        if (intersectPos) {
          const lineLocationDist = distance(start, intersectPos, options);
          intersectPt = point(intersectPos, {
            dist: distance(pt, intersectPos, options),
            multiFeatureIndex: multiFeatureIndex,
            location: length + lineLocationDist,
            multiFeatureLocation: multiFeatureLength + lineLocationDist,
          });
        }

        if (
          intersectPt &&
          intersectPt.properties.dist < closestPt.properties.dist
        ) {
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

        // update length and multiFeatureLength
        length += sectionLength;
        multiFeatureLength += sectionLength;
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

function magnitude(v: Vector) {
  return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2));
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
  const lat = radiansToDegrees(Math.asin(z));
  const lng = radiansToDegrees(Math.atan2(y, x));

  return [lng, lat];
}

function nearestPointOnSegment(
  posA: Position, // start point of segment to measure to
  posB: Position, // end point of segment to measure to
  posC: Position // point to measure from
): [Position, boolean, boolean] {
  // Based heavily on this article on finding cross track distance to an arc:
  // https://gis.stackexchange.com/questions/209540/projecting-cross-track-distance-on-great-circle

  // Convert spherical (lng, lat) to cartesian vector coords (x, y, z)
  // In the below https://tikz.net/spherical_1/ we convert lng (𝜙) and lat (𝜃)
  // into vectors with x, y, and z components with a length (r) of 1.
  const A = lngLatToVector(posA); // the vector from 0,0,0 to posA
  const B = lngLatToVector(posB); // ... to posB
  const C = lngLatToVector(posC); // ... to posC

  // Components of target point.
  const [Cx, Cy, Cz] = C;

  // Calculate coefficients.
  const [D, E, F] = cross(A, B);
  const a = E * Cz - F * Cy;
  const b = F * Cx - D * Cz;
  const c = D * Cy - E * Cx;

  const f = c * E - b * F;
  const g = a * F - c * D;
  const h = b * D - a * E;

  const t = 1 / Math.sqrt(Math.pow(f, 2) + Math.pow(g, 2) + Math.pow(h, 2));

  // Vectors to the two points these great circles intersect.
  const I1: Vector = [f * t, g * t, h * t];
  const I2: Vector = [-1 * f * t, -1 * g * t, -1 * h * t];

  // Figure out which is the closest intersection to this segment of the great
  // circle.
  const angleAB = angle(A, B);
  const angleAI1 = angle(A, I1);
  const angleBI1 = angle(B, I1);
  const angleAI2 = angle(A, I2);
  const angleBI2 = angle(B, I2);

  let I: Vector;

  if (
    (angleAI1 < angleAI2 && angleAI1 < angleBI2) ||
    (angleBI1 < angleAI2 && angleBI1 < angleBI2)
  ) {
    I = I1;
  } else {
    I = I2;
  }

  // I is the closest intersection to the segment, though might not actually be
  // ON the segment.

  // If angle AI or BI is greater than angleAB, I lies on the circle *beyond* A
  // and B so use the closest of A or B as the intersection
  if (angle(A, I) > angleAB || angle(B, I) > angleAB) {
    if (
      distance(vectorToLngLat(I), vectorToLngLat(A)) <=
      distance(vectorToLngLat(I), vectorToLngLat(B))
    ) {
      return [vectorToLngLat(A), true, false];
    } else {
      return [vectorToLngLat(B), false, true];
    }
  }

  // As angleAI nor angleBI don't exceed angleAB, I is on the segment
  return [vectorToLngLat(I), false, false];
}

export { nearestPointOnLine };
export default nearestPointOnLine;
