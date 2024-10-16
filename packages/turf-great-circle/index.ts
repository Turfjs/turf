import type {
  Feature,
  GeoJsonProperties,
  LineString,
  MultiLineString,
  Point,
  Position,
} from "geojson";
import { lineString } from "@turf/helpers";
import { getCoord } from "@turf/invariant";
import { GreatCircle } from "./lib/arc.js";

/**
 * Calculate great circles routes as {@link LineString} or {@link MultiLineString}.
 * If the `start` and `end` points span the antimeridian, the resulting feature will
 * be split into a `MultiLineString`. If the `start` and `end` positions are the same
 * then a `LineString` will be returned with duplicate coordinates the length of the `npoints` option.
 *
 * @name greatCircle
 * @param {Coord} start source point feature
 * @param {Coord} end destination point feature
 * @param {Object} [options={}] Optional parameters
 * @param {Object} [options.properties={}] line feature properties
 * @param {number} [options.npoints=100] number of points
 * @param {number} [options.offset=10] offset controls the likelyhood that lines will
 * be split which cross the dateline. The higher the number the more likely.
 * @returns {Feature<LineString | MultiLineString>} great circle line feature
 * @example
 * var start = turf.point([-122, 48]);
 * var end = turf.point([-77, 39]);
 *
 * var greatCircle = turf.greatCircle(start, end, {properties: {name: 'Seattle to DC'}});
 *
 * //addToMap
 * var addToMap = [start, end, greatCircle]
 */
function greatCircle(
  start: Feature<Point, GeoJsonProperties> | Point | Position,
  end: Feature<Point, GeoJsonProperties> | Point | Position,
  options: {
    properties?: GeoJsonProperties;
    npoints?: number;
    offset?: number;
  } = {}
): Feature<LineString | MultiLineString> {
  // Optional parameters
  if (typeof options !== "object") throw new Error("options is invalid");
  const { properties = {}, npoints = 100, offset = 10 } = options;

  const startCoord = getCoord(start);
  const endCoord = getCoord(end);

  if (startCoord[0] === endCoord[0] && startCoord[1] === endCoord[1]) {
    const arr = Array(npoints).fill([startCoord[0], startCoord[1]]);
    return lineString(arr, properties);
  }

  const generator = new GreatCircle(
    { x: startCoord[0], y: startCoord[1] },
    { x: endCoord[0], y: endCoord[1] },
    properties
  );

  const line = generator.Arc(npoints, { offset: offset });

  return line.json();
}

export { greatCircle };
export default greatCircle;
