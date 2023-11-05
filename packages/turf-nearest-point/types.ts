import { point, featureCollection } from "@turf/helpers";
import nearestPoint from "./index";

const targetPoint = point([28.965797, 41.010086], { "marker-color": "#0F0" });
const points = featureCollection([
  point([28.973865, 41.011122]),
  point([28.948459, 41.024204]),
  point([28.938674, 41.013324]),
]);
const nearest = nearestPoint(targetPoint, points, { units: "kilometers" });
nearest.properties.distanceToPoint;
nearest.properties.featureIndex;
