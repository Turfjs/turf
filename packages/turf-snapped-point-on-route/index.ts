import bearing from "@turf/bearing";
import distance from "@turf/distance";
import destination from "@turf/destination";
import lineIntersects from "@turf/line-intersect";
import { flattenEach } from "@turf/meta";
import {
  point,
  lineString,
  Feature,
  Point,
  LineString,
  MultiLineString,
  Coord,
  Units,
} from "@turf/helpers";
import { getCoords } from "@turf/invariant";

export interface SnappedPointOnRoute extends Feature<Point> {
  properties: {
    index?: number;
    dist?: number;
    location?: number;
    [key: string]: any;
  };
}

function processRouteSegment(length, closestPt, pt, i, coords, options) {
  //start
  const start = point(coords[i]);
  start.properties.dist = distance(pt, start, options);
  //stop
  const stop = point(coords[i + 1]);
  stop.properties.dist = distance(pt, stop, options);
  // sectionLength
  const sectionLength = distance(start, stop, options);
  //perpendicular
  const heightDistance = Math.max(start.properties.dist, stop.properties.dist);
  const direction = bearing(start, stop);

  const perpendicularPt1 = destination(
    pt,
    heightDistance,
    direction + 90,
    options
  );
  const perpendicularPt2 = destination(
    pt,
    heightDistance,
    direction - 90,
    options
  );

  const intersect = lineIntersects(
    lineString([
      perpendicularPt1.geometry.coordinates,
      perpendicularPt2.geometry.coordinates,
    ]),
    lineString([start.geometry.coordinates, stop.geometry.coordinates])
  );
  let intersectPt = null;
  if (intersect.features.length > 0) {
    intersectPt = intersect.features[0];
    intersectPt.properties.dist = distance(pt, intersectPt, options);
    intersectPt.properties.location =
      length + distance(start, intersectPt, options);
  }

  if (start.properties.dist < closestPt.properties.dist) {
    closestPt = start;
    closestPt.properties.index = i;
    closestPt.properties.location = length;
  }
  if (stop.properties.dist < closestPt.properties.dist) {
    closestPt = stop;
    closestPt.properties.index = i + 1;
    closestPt.properties.location = length + sectionLength;
  }
  if (intersectPt && intersectPt.properties.dist < closestPt.properties.dist) {
    closestPt = intersectPt;
    closestPt.properties.index = i;
  }

  // update length
  length += sectionLength;

  return {
    closestPt: closestPt,
    length: length,
  };
}

function snappingShouldAbort(pt, i, coords, options) {
  const startDistance = distance(pt, coords[i], options);
  const stopDistance = distance(pt, coords[i + 1], options);

  return (
    stopDistance > startDistance &&
    stopDistance >= options.abortDistance &&
    startDistance >= options.abortDistance
  );
}

/**
 * Takes a {@link Point} and a {@link LineString} and calculates the closest Point on the (Multi)LineString.
 *
 * @name snappedPointOnRoute
 * @param {Geometry|Feature<LineString|MultiLineString>} lines lines to snap to
 * @param {Geometry|Feature<Point>|number[]} pt point to snap from
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @returns {Feature<Point>} closest point on the `line` to `point`. The properties object will contain three values: `index`: closest point was found on nth line part, `dist`: distance between pt and the closest point, `location`: distance along the line between start and the closest point.
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
 * var snapped = turf.snappedPointOnRoute(line, pt, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [line, pt, snapped];
 * snapped.properties['marker-color'] = '#00f';
 */
function snappedPointOnRoute<G extends LineString | MultiLineString>(
  lines: Feature<G> | G,
  pt: Coord,
  options: {
    units?: Units;
    snapDistance?: number;
    abortDistance?: number;
  } = {
    units: "meters",
    snapDistance: 40,
    abortDistance: 1000,
  }
): SnappedPointOnRoute {
  let closestPt: any = point([Infinity, Infinity], {
    dist: Infinity,
  });

  let length = 0.0;
  let finished = false;

  flattenEach(lines, function (line: any) {
    if (finished) return;

    const coords: any = getCoords(line);

    for (let i = 0; i < coords.length - 1; i++) {
      const segment = processRouteSegment(
        length,
        closestPt,
        pt,
        i,
        coords,
        options
      );

      closestPt = segment.closestPt;
      length = segment.length;

      if (closestPt.properties.dist <= options.snapDistance) {
        finished = true;

        // local scan for potentially closer point
        for (let j = i + 1; j < coords.length - 1; j++) {
          const local = processRouteSegment(
            length,
            closestPt,
            pt,
            j,
            coords,
            options
          );

          const distance = local.closestPt.properties.dist;

          if (distance > closestPt.properties.dist) return;

          closestPt = local.closestPt;
          length = local.length;
        }

        return;
      } else if (snappingShouldAbort(pt, i, coords, options)) {
        finished = true;
        return;
      }
    }
  });

  return closestPt;
}

export default snappedPointOnRoute;
