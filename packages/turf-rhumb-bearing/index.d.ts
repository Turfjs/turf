import { Coord } from "@turf/helpers";
/**
 * Takes two {@link Point|points} and finds the bearing angle between them along a Rhumb line
 * i.e. the angle measured in degrees start the north line (0 degrees)
 *
 * @name rhumbBearing
 * @param {Coord} start starting Point
 * @param {Coord} end ending Point
 * @param {Object} [options] Optional parameters
 * @param {boolean} [options.final=false] calculates the final bearing if true
 * @returns {number} bearing from north in decimal degrees, between -180 and 180 degrees (positive clockwise)
 * @example
 * var point1 = turf.point([-75.343, 39.984], {"marker-color": "#F00"});
 * var point2 = turf.point([-75.534, 39.123], {"marker-color": "#00F"});
 *
 * var bearing = turf.rhumbBearing(point1, point2);
 *
 * //addToMap
 * var addToMap = [point1, point2];
 * point1.properties.bearing = bearing;
 * point2.properties.bearing = bearing;
 */
declare function rhumbBearing(start: Coord, end: Coord, options?: {
    final?: boolean;
}): number;
export default rhumbBearing;
