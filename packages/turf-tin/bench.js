const fs = require("fs");
const path = require("path");
const Benchmark = require("benchmark");
const tin = require("./index").default;

const points = JSON.parse(
  fs.readFileSync(path.join(__dirname, "test", "Points.json"))
);

const suite = new Benchmark.Suite("turf-tin");
suite
  .add("turf-tin", () => tin(points, "elevation"))
  .on("cycle", (event) => console.log(String(event.target)))
  .run();
