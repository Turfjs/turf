import { Feature, Point, LineString, MultiLineString } from "geojson";
import bearing from "@turf/bearing";
import distance from "@turf/distance";
import destination from "@turf/destination";
import lineIntersects from "@turf/line-intersect";
import { flattenEach } from "@turf/meta";
import { point, lineString, Coord, Units } from "@turf/helpers";
import { getCoords } from "@turf/invariant";

/**
 * Takes a {@link Point} and a {@link LineString} and calculates the closest Point on the (Multi)LineString.
 *
 * @name nearestPointOnLine
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
    location: number;
    [key: string]: any;
  }
> {
  if (!lines || !pt) {
    throw new Error("lines and pt are required arguments");
  }

  let closestPt: Feature<
    Point,
    { dist: number; index: number; location: number }
  > = point([Infinity, Infinity], {
    dist: Infinity,
    index: -1,
    location: -1,
  });

  let length = 0.0;
  flattenEach(lines, function (line: any) {
    const coords: any = getCoords(line);

    for (let i = 0; i < coords.length - 1; i++) {
      //start
      const start: Feature<Point, { dist: number }> = point(coords[i]);
      start.properties.dist = distance(pt, start, options);
      //stop
      const stop: Feature<Point, { dist: number }> = point(coords[i + 1]);
      stop.properties.dist = distance(pt, stop, options);
      // sectionLength
      const sectionLength = distance(start, stop, options);
      //perpendicular
      const heightDistance = Math.max(
        start.properties.dist,
        stop.properties.dist
      );
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
      let intersectPt:
        | Feature<Point, { dist: number; location: number }>
        | undefined;

      if (intersect.features.length > 0 && intersect.features[0]) {
        intersectPt = {
          ...intersect.features[0],
          properties: {
            dist: distance(pt, intersect.features[0], options),
            location: length + distance(start, intersect.features[0], options),
          },
        };
      }

      if (start.properties.dist < closestPt.properties.dist) {
        closestPt = {
          ...start,
          properties: { ...start.properties, index: i, location: length },
        };
      }

      if (stop.properties.dist < closestPt.properties.dist) {
        closestPt = {
          ...stop,
          properties: {
            ...stop.properties,
            index: i + 1,
            location: length + sectionLength,
          },
        };
      }

      if (
        intersectPt &&
        intersectPt.properties.dist < closestPt.properties.dist
      ) {
        closestPt = {
          ...intersectPt,
          properties: { ...intersectPt.properties, index: i },
        };
      }
      // update length
      length += sectionLength;
    }
  });

  return closestPt;
}

export default nearestPointOnLine;
