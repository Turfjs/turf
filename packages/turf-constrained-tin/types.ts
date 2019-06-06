import {featureCollection, point} from "@turf/helpers";
import constrainedTin from "./";

const points = featureCollection([
  point([0, 0], {elevation: 20}),
  point([10, 10], {elevation: 10}),
  point([30, 30], {elevation: 50}),
]);
constrainedTin(points);
constrainedTin(points, [],{z: "elevation"});
