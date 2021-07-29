import { Feature, LineString, Position } from "geojson";
import { getCoords } from "@turf/invariant";

/**
 * Takes a ring and return true or false whether or not the ring is clockwise or counter-clockwise.
 *
 * @name booleanClockwise
 * @param {Feature<LineString>|LineString|Array<Array<number>>} line to be evaluated
 * @returns {boolean} true/false
 * @example
 * var clockwiseRing = turf.lineString([[0,0],[1,1],[1,0],[0,0]]);
 * var counterClockwiseRing = turf.lineString([[0,0],[1,0],[1,1],[0,0]]);
 *
 * turf.booleanClockwise(clockwiseRing)
 * //=true
 * turf.booleanClockwise(counterClockwiseRing)
 * //=false
 */
export default function booleanClockwise(
  line: Feature<LineString> | LineString | Position[]
): boolean {
  const ring = getCoords(line);
  let sum = 0;
  let i = 1;
  let prev;
  let cur;

  while (i < ring.length) {
    prev = cur || ring[0];
    cur = ring[i];
    sum += (cur[0] - prev[0]) * (cur[1] + prev[1]);
    i++;
  }
  return sum > 0;
}
