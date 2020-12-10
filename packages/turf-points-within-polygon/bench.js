import Benchmark from "benchmark";
import { featureCollection, point, polygon } from "@turf/helpers";
import pointsWithinPolygon from "./index";

var poly1 = polygon([
  [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 0],
  ],
]);
var poly2 = polygon([
  [
    [10, 0],
    [20, 10],
    [20, 20],
    [10, 0],
  ],
]);
var polyFC = featureCollection([poly1, poly2]);
var pt1 = point([1, 1], { population: 500 });
var pt2 = point([1, 3], { population: 400 });
var pt3 = point([14, 2], { population: 600 });
var pt4 = point([13, 1], { population: 500 });
var pt5 = point([19, 7], { population: 200 });
var pt6 = point([100, 7], { population: 200 });
var ptFC = featureCollection([pt1, pt2, pt3, pt4, pt5, pt6]);

var suite = new Benchmark.Suite("turf-points-within-polygon");
suite
  .add("turf-points-within-polygon", () => pointsWithinPolygon(ptFC, polyFC))
  .on("cycle", (e) => console.log(String(e.target)))
  .on("complete", () => {})
  .run();
