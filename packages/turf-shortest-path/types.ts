import { point, featureCollection, polygon } from "@turf/helpers";
import shortestPath from "./";

const start = point([-5, -6]);
const end = point([9, -6]);

shortestPath(start.geometry, end.geometry.coordinates);
shortestPath(start, end);
shortestPath(start, end, {
  obstacles: polygon([
    [
      [0, -7],
      [5, -7],
      [5, -3],
      [0, -3],
      [0, -7],
    ],
  ]),
});
shortestPath(start, end, {
  obstacles: featureCollection([
    polygon([
      [
        [0, -7],
        [5, -7],
        [5, -3],
        [0, -3],
        [0, -7],
      ],
    ]),
  ]),
});
shortestPath(start, end, {
  resolution: 1000,
});
