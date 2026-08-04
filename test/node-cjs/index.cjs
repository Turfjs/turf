/* eslint-disable @typescript-eslint/no-require-imports */

const turf = require("@turf/turf");

const polygon = turf.polygon([
  [
    [125, -15],
    [113, -22],
    [154, -27],
    [144, -15],
    [125, -15],
  ],
]);

const area = turf.area(polygon);

console.log(area);
