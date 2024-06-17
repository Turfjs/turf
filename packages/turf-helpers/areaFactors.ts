import type { AreaUnits } from "./AreaUnits.js";

/**

 * Area of measurement factors based on 1 square meter.
 *
 * @memberof helpers
 * @type {Object}
 */
export const areaFactors: Record<AreaUnits, number> = {
  acres: 0.000247105,
  centimeters: 10000,
  centimetres: 10000,
  feet: 10.763910417,
  hectares: 0.0001,
  inches: 1550.003100006,
  kilometers: 0.000001,
  kilometres: 0.000001,
  meters: 1,
  metres: 1,
  miles: 3.86e-7,
  nauticalmiles: 2.9155334959812285e-7,
  millimeters: 1000000,
  millimetres: 1000000,
  yards: 1.195990046,
};
