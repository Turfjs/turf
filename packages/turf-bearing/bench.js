const Benchmark = require("benchmark");
const bearing = require("./index").default;

var start = [-75.4, 39.4];
var end = [-75.534, 39.123];

var suite = new Benchmark.Suite("turf-bearing");
suite
  .add("initial bearing", () => bearing(start, end))
  .add("final bearing", () => bearing(start, end, { final: true }))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
