const Benchmark = require("benchmark");
const { polygon, featureCollection, point } = require("@turf/helpers");
const collect = require("./index").default;

var poly1 = polygon([
  [
    [0, 0],
    [10, 0],
    [0, 10],
    [0, 10],
    [0, 0],
  ],
]);
var poly2 = polygon([
  [
    [10, 0],
    [20, 10],
    [20, 20],
    [20, 0],
    [10, 0],
  ],
]);
var polyFC = featureCollection([poly1, poly2]);
var pt1 = point([5, 5], { population: 200 });
var pt2 = point([1, 3], { population: 600 });
var pt3 = point([14, 2], { population: 100 });
var pt4 = point([13, 1], { population: 200 });
var pt5 = point([19, 7], { population: 300 });

var ptFC = featureCollection([pt1, pt2, pt3, pt4, pt5]);
var suite = new Benchmark.Suite("turf-collect");
suite
  .add("turf-collect", function () {
    collect(polyFC, ptFC, "population", "outPopulation");
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .run();
