import type { Units } from "./Units.js";
import { earthRadius } from "./earthRadius.js";

/**
 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
 *
 * Keys are the name of the unit, values are the number of that unit in a single radian
 *
 * @memberof helpers
 * @type {Object}
 */
export const factors: Record<Units, number> = {
  centimeters: earthRadius * 100,
  centimetres: earthRadius * 100,
  degrees: 360 / (2 * Math.PI),
  feet: earthRadius * 3.28084,
  inches: earthRadius * 39.37,
  kilometers: earthRadius / 1000,
  kilometres: earthRadius / 1000,
  meters: earthRadius,
  metres: earthRadius,
  miles: earthRadius / 1609.344,
  millimeters: earthRadius * 1000,
  millimetres: earthRadius * 1000,
  nauticalmiles: earthRadius / 1852,
  radians: 1,
  yards: earthRadius * 1.0936,
};
