import { ellipse, ellipseOld, ellipseRiemann } from "./index.js";
import { coordEach } from "@turf/meta";
import { featureCollection, point } from "@turf/helpers";
import { Feature, Point } from "geojson";

let center = [-73.9975, 40.730833];
const xSemiAxis = 5;
const ySemiAxis = 1;
const steps = 32;
const xDiff = 0.4;
const yDiff = 0.4;

const pts: Feature<Point>[] = [];

const startTimeOld = performance.now();
const ellOld = ellipseOld(center, xSemiAxis, ySemiAxis, {
  steps,
});
const endTimeOld = performance.now();
coordEach(ellOld, (coord) => pts.push(point(coord, { "marker-color": "red" })));

// center = [center[0] + xDiff, center[1]];
// const startTime0 = performance.now();
// const ell0 = ellipse(center, xSemiAxis, ySemiAxis, {
//   steps,
//   accuracy: 0,
// });
// const endTime0 = performance.now();
// coordEach(ell0, (coord) =>
//   pts.push(point(coord, { "marker-color": "#0000ff" }))
// );

center = [center[0], center[1] + yDiff];
const startTime1 = performance.now();
const ell1 = ellipse(center, xSemiAxis, ySemiAxis, {
  steps,
  accuracy: 1,
});
const endTime1 = performance.now();
coordEach(ell1, (coord) =>
  pts.push(point(coord, { "marker-color": "#00f0c0" }))
);

center = [center[0], center[1] + yDiff];
const startTime2 = performance.now();
const ell2 = ellipse(center, xSemiAxis, ySemiAxis, {
  steps,
  accuracy: 2,
});
const endTime2 = performance.now();
coordEach(ell2, (coord) =>
  pts.push(point(coord, { "marker-color": "#98ff98" }))
);

center = [center[0], center[1] + yDiff];
const startTime3 = performance.now();
const ell3 = ellipse(center, xSemiAxis, ySemiAxis, {
  steps,
  accuracy: 3,
});
const endTime3 = performance.now();
coordEach(ell3, (coord) =>
  pts.push(point(coord, { "marker-color": "#90ee90" }))
);

center = [center[0], center[1] + yDiff];
const startTimeR = performance.now();
const ellR = ellipseRiemann(center, xSemiAxis, ySemiAxis, {
  steps,
});
const endTimeR = performance.now();
coordEach(ellR, (coord) =>
  pts.push(point(coord, { "marker-color": "#0000ff" }))
);

// console.log(JSON.stringify(featureCollection(pts)));
// console.log(`1 ${(endTime1 - startTime1) / (endTimeOld - startTimeOld)}x`);
// console.log(`2 ${(endTime2 - startTime2) / (endTimeOld - startTimeOld)}x`);
// console.log(`3 ${(endTime3 - startTime3) / (endTimeOld - startTimeOld)}x`);
