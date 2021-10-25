import { BBox } from "geojson";
import { polygon } from "@turf/helpers";
import pointGrid from "./dist/js/index";

const cellSide = 50;
const bbox: BBox = [-95, 30, -85, 40];
const poly = polygon([
  [
    [20, 30],
    [10, 10],
    [20, 20],
    [20, 30],
  ],
]);

pointGrid(bbox, cellSide);
pointGrid(bbox, cellSide, { units: "miles" });
pointGrid(bbox, cellSide, { units: "miles", mask: poly });
pointGrid(bbox, cellSide, {
  units: "miles",
  mask: poly,
  properties: { foo: "bar" },
});
