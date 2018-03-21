import { Feature, Polygon } from "@turf/helpers";
/**
 * Takes a polygon and return true or false as to whether it is concave or not.
 *
 * @name booleanConcave
 * @param {Feature<Polygon>} polygon to be evaluated
 * @returns {boolean} true/false
 * @example
 * var convexPolygon = turf.polygon([[[0,0],[0,1],[1,1],[1,0],[0,0]]]);
 *
 * turf.booleanConcave(convexPolygon)
 * //=false
 */
export default function booleanConcave(polygon: Feature<Polygon> | Polygon): boolean;
